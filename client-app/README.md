# Client Side Application

Client Application is written on Typescript v 2.2.0 Programming Language, using Angular 4 Framework.
___
## Used soft

Used Libraries and frameworks:

| Name | Version |
| ------ | ------ |
| Angular | 4.2.4 |
| Angular CLI | 1.4.3 |
| Color Picker | 1.4.2 |
| Karma | 1.4.1 |
| Bootstrap | 3.3.7 |
| Font Awesome | 4.7.0 |
| Fabric JS | 1.7.16 |
| PrimeNG | 4.2.2 |
| rxjs | 5.1.0 |
| tether js | 1.4.3 |

## Functionality

###Canvas Home page

Browser Painter Alternative provides the following functionality:

1. Rectangle tool
2. Triangle tool
3. Square tool
4. Circle tool
5. Arrow tools with 4 arrow types
6. Editable text tool (fonts, spacing and coloring supported)
7. Free drawing tool
8. Eraser tool (canvas background color is considered as eraser color)

All the tools above are placed to the left of the page.
Canvas itself is placed at the center.

You can also use some options to change figures, arrows or lines from the right panel. To see the options you need just select canvas itself or the figure.

Options:

- Canvas
    - Background color
- Arrow
    - Opacity
- Free Line
    - Color
    - Thickness
- Eraser
    - Thickness
- Figure
    - Color
    - Opacity
- Text
    - Opacity
    - Color
    - Font family
    - Text align
    - Text style
    - Font size
    - Line height
    - Char spacing

Any figure, text or arrow, except free line, can be cloned or removed from canvas by clicking to respective button, placed at the top of options panel

The base options are the following:
- Open canvas image representation, that can be saved to an image from browser
- Save canvas to local browser storage (will be available while page is opened)
- Load canvas from the storage (if canvas copy was previously saved)
- Clear canvas
Those options can be activated by clicking to respective button on the top panel above the canvas.
Canvas will be cleared after you agree to the confirmation dialog.

### Api page

There're 2 panels on this page:

- Fonts
- Server Date Time

The Api returns fonts list and server date to respective panel.
If Web.Api Application is not launched, you'll see the red error message on the right top page corner.

### Launch URLs

Client App launches on url: http://localhost:4200 by default
Karma Test App launches on http://localhost:9876 by default