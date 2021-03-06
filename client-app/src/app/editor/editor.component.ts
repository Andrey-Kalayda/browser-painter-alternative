import { Component, OnInit, OnDestroy } from '@angular/core';
import {ColorPickerService} from 'angular4-color-picker';
import { Subscription } from 'rxjs/Rx';
import { ConfirmationService } from 'primeng/primeng';
import { EditorApiService } from '../api/service/editor-api.service';
import { DropDownStringItem } from '../api/model/dropdown-string-item.model';
import { EditorHubService, HubMessage } from '../websocket/editor-hub.service';
import { Message } from 'primeng/components/common/message';
import { NotificationService } from '../core/notification.service';
import { Subject } from 'rxjs/Subject';

import 'fabric';

declare const fabric: any;

const DEFAULT_STROKE_COLOR = '#000000';

@Component({
  moduleId: module.id,
  selector: 'app-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})

export class EditorComponent implements OnInit, OnDestroy {
  fontList: Array<DropDownStringItem> = [];
  selectedFontFamilyItem: DropDownStringItem;

  private canvas: any;
  private props: any = {
    canvasFill: '#ffffff',
    id: null,
    opacity: null,
    strokeWidth: 1,
    strokeColor: DEFAULT_STROKE_COLOR,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    textDecoration: ''
  };

  private size: any = {
    width: 550,
    height: 500
  };

  private textEditor: boolean = false;
  private imageEditor: boolean = false;
  private figureEditor: boolean = false;
  private freeLineEditor: boolean = false;
  private eraserEditor: boolean = false;
  private selected: any;
  private textString: string;

  private hubSubscription: Subscription;

  private updateDrawingMode: Subject<boolean> = new Subject<boolean>();

  private objPropsToInclude = ['id', 'selectable', 'hasRotatingPoint', '_controlsVisibility', 'transparentCorners', 'isEraser', 'opacity'];

  constructor(private apiService: EditorApiService,
              private cpService: ColorPickerService,
              private hubService: EditorHubService,
              private notificationService: NotificationService,
              private confirmService: ConfirmationService) {
  }

  ngOnInit() {
    // Connect to signalR hub
    this.hubService.connect();
    // add handlers for canvas edit events
    this.hubService.addReceiveHandler('addItem');
    this.hubService.addReceiveHandler('updateItem');
    this.hubService.addReceiveHandler('setActiveStyle');
    this.hubService.addReceiveHandler('setActiveProp');
    this.hubService.addReceiveHandler('removeItem');
    this.hubService.addReceiveHandler('canvasFill');
    
    this.apiService.getFonts().subscribe(fonts => {
        this.fontList = fonts;
        this.selectedFontFamilyItem = this.fontList.filter(x => x.key === 'helvetica')[0];
        this.props.fontFamily = this.selectedFontFamilyItem.key;
      },
      error => this.notificationService.addError('Api Error', error));
    this.updateDrawingMode.subscribe(value => {
      this.canvas.isDrawingMode = value;
    });
    // subscribe to canvas update from other users
    this.hubSubscription = this.hubService.onMessageReceivedStream().subscribe(message => {
      if (message.key === 'onConnect') {
        // notify about new user
        this.notificationService.addInfo('New User', message.value);
      } else if (message.key === 'onDisconnect') {
        // notify about disconnected user
        this.notificationService.addInfo('User Logout', message.value);
      } else if (message.key === 'addItem') {
        this.extendJsonObj(JSON.parse(message.value), (obj) => {
          this.canvas.add(obj);
          this.canvas.renderAll();
        });
      } else if (message.key === 'updateItem') {
        let jsonObj = JSON.parse(message.value);
        if (jsonObj.type !== 'group') {
          this.updateObjectOnCanvas(jsonObj);
        }
      } else if (message.key === 'setActiveStyle') {
        let styleObj = JSON.parse(message.value);
        let obj = this.canvas._objects.filter(x => x.id === styleObj.id);
        if (obj.length > 0 && (!this.selected || obj[0].id !== this.selected.id)) {
          let object = obj[0];
          if (object.setSelectionStyles && object.isEditing) {
            var style = {};
            style[styleObj.styleName] = styleObj.value;
            object.setSelectionStyles(style);
          }
          else {
            object.set(styleObj.styleName, styleObj.value);
          }
          this.canvas.renderAll();
        }
      } else if (message.key === 'setActiveProp') {
        let propObj = JSON.parse(message.value);
        let obj = this.canvas._objects.filter(x => x.id === propObj.id);
        if (obj.length > 0 && (!this.selected || obj[0].id !== this.selected.id)) {
          let object = obj[0];
          object.set(propObj.name, propObj.value);
          this.canvas.renderAll();
        }
      } else if (message.key === 'removeItem') {
        let jsonObj =  JSON.parse(message.value);
        if (jsonObj.ids) {
          jsonObj.ids.forEach(id => {
            this.removeObjectOnCanvas(id);
          });
        } else {
          this.removeObjectOnCanvas(jsonObj.id);
        }
      } else if (message.key === 'canvasFill') {
        this.props.canvasFill = JSON.parse(message.value);
        this.canvas.backgroundColor = this.props.canvasFill;
        this.canvas.renderAll();
      }
    });

    //setup front side canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });

    // bind handlers to canvas events
    this.canvas.on({
      'object:modified': (e: Event) => {
        this.hubService.sendMessage({
          key: 'updateItem',
          value: JSON.stringify((<any>e.target).toJSON(this.objPropsToInclude))
        });
       },
      'object:selected': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {
          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
            case 'path':
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      },
      'mouse:up': (e) => {
        if (this.canvas.isDrawingMode) {
          this.canvas._objects
            .filter(x => x.type === 'path' && x.selectable)
            .forEach(obj => {
              obj.selectable = false;
              obj.isEraser = this.eraserEditor;
            });
            this.canvas.renderAll();
            let object = this.canvas._objects[this.canvas._objects.length - 1];
            object.id = this.randomId();
            this.hubService.sendMessage({
              key: 'addItem',
              value: JSON.stringify(object.toJSON(this.objPropsToInclude))
            });
        }
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  ngOnDestroy(): void {
    this.hubSubscription.unsubscribe();
    this.updateDrawingMode.unsubscribe();
    //this.hubService.disconnect();
  }

  /*------------------------Block elements------------------------*/

  //Block "Add text"

  addText() {
    if (this.textString.length > 0) {
      this.updateDrawingMode.next(false);
      let textString = this.textString;
      let text = new fabric.IText(textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true
      });
      text.id = this.randomId();
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
      this.hubService.sendMessage({
        key: 'addItem',
        value: JSON.stringify(text.toJSON(this.objPropsToInclude))
      });
    }
  }

  //Block "Add images"

  getImgPolaroid(event: any) {
    let el = event.target;
    this.updateDrawingMode.next(false);
    fabric.Image.fromURL(el.src, (image) => {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12
      });
      image.setWidth(150);
      image.setHeight(150);
      image.id = this.randomId();
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
      this.hubService.sendMessage({
        key: 'addItem',
        value: JSON.stringify(image.toJSON(this.objPropsToInclude))
      });
    });
  }

  //Block "Add figure"

  addFigure(figure) {
    let add: any;
    this.updateDrawingMode.next(false);
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0, fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0, fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    add.id = this.randomId();
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
    this.hubService.sendMessage({
      key: 'addItem',
      value: JSON.stringify(add.toJSON(this.objPropsToInclude))
    });
  }

  // Block "Free Drawing"
  setFreeDrawingMode(): void {
    this.resetPanels();
    this.freeLineEditor = true;
    this.updateDrawingMode.next(true);
    this.props.strokeColor = DEFAULT_STROKE_COLOR;
    this.canvas.freeDrawingBrush.color = this.props.strokeColor;
    this.canvas.freeDrawingBrush.width = this.props.strokeWidth;
  }

  setEraserMode(): void {
    this.resetPanels();
    this.eraserEditor = true;
    this.updateDrawingMode.next(true);
    this.props.strokeColor = this.props.canvasFill;
    this.canvas.freeDrawingBrush.color = this.props.strokeColor;
    this.canvas.freeDrawingBrush.width = this.props.strokeWidth;
  }

  /*Canvas*/

  selectItemAfterAdded(obj) {
    this.canvas.deactivateAllWithDispatch().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    this.canvas.backgroundColor = this.props.canvasFill;
    this.canvas.renderAll();
    this.hubService.sendMessage({
      key: 'canvasFill',
      value: JSON.stringify(this.props.canvasFill)
    });
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName: string, object?: any) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }


  setActiveStyle(styleName: string, value, object?: any) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
    }
    else {
      object.set(styleName, value);
    }

    this.canvas.renderAll();

    this.hubService.sendMessage({
      key: 'setActiveStyle',
      value: JSON.stringify({
        id: object.id,
        styleName: styleName,
        value: value
      })
    });
  }


  getActiveProp(name: string, object?: any) {
    var object = object || this.canvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value, object?: any) {
    var object = object || this.canvas.getActiveObject();
    if (!object) return;
    object.set(name, value);
    this.canvas.renderAll();
    this.hubService.sendMessage({
      key: 'setActiveProp',
      value: JSON.stringify({
        id: object.id,
        name: name,
        value: value
      })
    });
  }

  clone() {
    let activeObject = this.canvas.getActiveObject();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
        this.hubService.sendMessage({
          key: 'addItem',
          value: JSON.stringify(clone.toJSON(this.objPropsToInclude))
        });
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
  }

  getStrokeWidth() {
    this.props.strokeWidth = this.getActiveProp('strokeWidth');
  }

  setStrokeWidth(){
    this.setActiveProp('strokeWidth', this.props.strokeWidth, this.canvas._objects[this.canvas._objects.length - 1]);
    this.canvas.freeDrawingBrush.width = this.props.strokeWidth;
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getStrokeColor() {
    this.props.strokeColor = this.getActiveProp('stroke');
  }

  setStrokeColor() {
    let objects = this.canvas._objects.slice(-1);
    let object = objects[0].get('type') == 'path' && !objects[0].isEraser
      ? objects[0]
      : null;
    if (object != null) {
      object.set('stroke', this.props.strokeColor);
      this.canvas.renderAll();
      this.hubService.sendMessage({
        key: 'setActiveProp',
        value: JSON.stringify({
          id: object.id,
          name: 'stroke',
          value: this.props.strokeColor
        })
      });
    }
    this.canvas.freeDrawingBrush.color = this.props.strokeColor;
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
  }


  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }


  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.props.fontFamily = this.selectedFontFamilyItem.key;
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      this.canvas.remove(activeObject);
      this.hubService.sendMessage({
        key: 'removeItem',
        value: JSON.stringify({id: activeObject.id})
      });
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      let self = this;
      objectsInGroup.forEach(function(object) {
        self.canvas.remove(object);
      });
      this.hubService.sendMessage({
        key: 'removeItem',
        value: JSON.stringify({ids: activeGroup._objects.map(x => x.id)})
      });
    }
  }

  confirmClear() {
    if (this.canvas.getObjects().length > 0) {
      this.confirmService.confirm({
        message: 'Are you really want to clear canvas?\nDon\'t worry, the other users won\'t lose their changes.',
        accept: () => {
          this.canvas.clear();
        }
      });
    }
  }

  rasterize() {
    if (!fabric.Canvas.supports('toDataURL')) {
      this.notificationService.addError('Canvas serialization error', 'This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      this.openDataUriWindow(this.canvas.toDataURL('png'));
    }
  }


  saveCanvasToJSON() {
    localStorage.setItem('Canvas', JSON.stringify(this.canvas.toJSON(this.objPropsToInclude)));

  }

  loadCanvasFromJSON() {
    let canvasObj = localStorage.getItem('Canvas');

    // and load everything from the same json
    this.canvas.loadFromJSON(canvasObj, () => {
      // making sure to render canvas at the end
      this.canvas.renderAll();
    });
  };

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
    this.freeLineEditor = false;
    this.eraserEditor = false;
  }

  private openDataUriWindow(url: string): void {
    let htmlContent = `<html>
      <style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>
      <body>
        <iframe src="${url}"></iframe
      </body>
      </html>`;
    let win = window.open();
    win.document.write(htmlContent);
  }

  private extendJsonObj(obj: any, callback: Function): void {
    let object = null;

    if (obj.type === 'line') {
      object = new fabric.Line([obj.x1, obj.y1, obj.x2, obj.y2], obj);
      callback(object);
    } else if (obj.type === 'triangle') {
      object = new fabric.Triangle(obj);
      callback(object);
    } else if (obj.type === 'rect') {
      object = new fabric.Rect(obj);
      callback(object);
    } else if (obj.type === 'circle') {
      object = new fabric.Circle(obj);
      callback(object);
    } else if (obj.type === 'i-text') {
      object = new fabric.IText(obj.text, obj);
      callback(object);
    } else if (obj.type === 'path') {
      object = new fabric.Path(obj.path, obj);
      callback(object);
    } else if (obj.type === 'polygon') {
      object = new fabric.Polygon(obj.path, obj);
      callback(object);
    } else if (obj.type ==='image') {
      fabric.Image.fromURL(obj.src, (image) => {
        image.set({
          left: obj.left,
          top: obj.top,
          angle: obj.angle,
          padding: obj.padding,
          cornersize: obj.cornersize,
          hasRotatingPoint: obj.hasRotatingPoint,
          peloas: obj.peloas,
          opacity: obj.opacity
        });
        image.setWidth(obj.width);
        image.setHeight(obj.height);
        image.id = obj.id;
        object = image;
        callback(object);
      });
    }
  }

  private updateObjectOnCanvas(object: any): void {
    this.extendJsonObj(object, (obj) => {
      let oldObj = this.canvas._objects.filter(x => x.id === obj.id);
      if (oldObj.length > 0 && (!this.selected || oldObj[0].id !== this.selected.id)) {
        let index = this.canvas._objects.indexOf(oldObj[0]);
        this.canvas._objects.splice(index, 1);
        this.canvas.add(obj);
        this.canvas.renderAll();
        this.canvas.renderAll();
      }
    });
  }

  private removeObjectOnCanvas(objectId: any): void {
    let obj = this.canvas._objects.filter(x => x.id === objectId);
    if (obj.length > 0 && (!this.selected || obj[0].id !== this.selected.id)) {
      let index = this.canvas._objects.indexOf(obj[0]);
      this.canvas._objects.splice(index, 1);
      this.canvas.renderAll();
    }
  }
}
