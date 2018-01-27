# Browser Painter Alternative app
___
Consists of:

- Client Side Application based on Angular 4 framework
- Server Side Application based on ASP.NET Core Web.Api Platform

Both of them can be found in respective folders:

- client-app
- web-api

You need the following soft to open the application:

- [Visual Studio Code](https://code.visualstudio.com/) editor (x86/x64)
- Node Package Manager (npm) v3.10.9
- [Node JS](https://nodejs.org/en/download/) v7.2.0
  _includes npm_

In fact, **VS Code** can suggest you to download missing packages or SDKs, you just need to agree with it.
Once you download and install all the needed soft, you just need to download repository to your computer in specific folder.
Then open that folder as root in **VS Code**.

## Restoring packages
- Open Integrated Terminal in **VS Code** (View -> Integrated Terminal) and move to `client-app` folder
- Put the following command
  ```
  npm install
  ```
  Then just wait a couple of minutes until NPM restores all the needed packages for Client Side Application

## Run Client
Open Integrated Terminal, go to the Client Side Application folder and put specific command
- Development Mode
  ```
  npm run dev
  ```
- Production Mode
  ```
  npm run prod
  ```

## Run Server (Web.Api)
- Press `F5` to run server app
- Press `Ctrl + F5` to run server app in debug mode

## Run Client Tests
Open Integrated Terminal, go to the Client Side Application folder and put the command
  ```
  npm test
  ```
Karma Test will be opened in Chrome browser
