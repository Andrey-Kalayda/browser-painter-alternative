using System;
using Microsoft.AspNetCore.Mvc;

using web_api.Models;

namespace web_api.Controllers
{
    [Route("api/[controller]")]
    public class EditorController : Controller
    {
        // Get api/editor/fonts
        [HttpGet("fonts")]
        public DropdownStringItem[] GetFonts()
        {
            return new DropdownStringItem[] 
            {
                new DropdownStringItem() { Key = "arial", Value = "Arial"},
                new DropdownStringItem() { Key = "helvetica", Value = "Helvetica"},
                new DropdownStringItem() { Key = "verdana", Value = "Verdana"},
                new DropdownStringItem() { Key = "courier", Value = "Courier"},
                new DropdownStringItem() { Key = "Roboto", Value = "Roboto"},
                new DropdownStringItem() { Key = "Open Sans", Value = "Open Sans"},
                new DropdownStringItem() { Key = "Zilla Slab", Value = "Zilla Slab"},
                new DropdownStringItem() { Key = "Lato", Value = "Lato"},
                new DropdownStringItem() { Key = "Bellefair", Value = "Bellefair"},
                new DropdownStringItem() { Key = "Fresca", Value = "Fresca"},
                new DropdownStringItem() { Key = "Raleway", Value = "Raleway"},
                new DropdownStringItem() { Key = "Open Sans Condensed", Value = "Open Sans Condensed"},
                new DropdownStringItem() { Key = "Indie Flower", Value = "Indie Flower"},
                new DropdownStringItem() { Key = "Josefin Sans", Value = "Josefin Sans"},
                new DropdownStringItem() { Key = "Inconsolata", Value = "Inconsolata"},
                new DropdownStringItem() { Key = "Pacifico", Value = "Pacifico"},
                new DropdownStringItem() { Key = "Gloria Hallelujah", Value = "Gloria Hallelujah"}
            };
        }

        // Get api/editor/fonts
        [HttpGet("serverdate")]
        public DateTime GetServerDate()
        {
            return DateTime.UtcNow;
        }
    }
}