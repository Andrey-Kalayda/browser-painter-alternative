# Server Side Application
Server Application is written on C# Programming Language on ASP.NET Core Platform.
___
## Used soft

Used Libraries and Platforms:

| Name | Version |
| ------ | ------ |
| ASP.NET Core | 2.0.5 |
| Web.API | 2.0 |
| SignalR | 1.0.0-alpha1-final |

## Functionality

Accepts all requests from only client app origin (`http://localhost:4200`) according to CORS restrictions in `Startup.cs`.

Has 2 GET methods:

- GetFonts
    <br/>Returns fonts dropdown list
- GetServerDate
    <br/>Returns server date

## Launch URLs

Server App launches on url: `http://localhost:5000` by default