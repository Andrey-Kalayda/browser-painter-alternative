using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace web_api.Hubs
{
    public class EditorHub: Hub
    {
        public async Task AddItem(String itemJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("addItem", itemJson);
        }
        public async Task UpdateItem(String itemJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("updateItem", itemJson);
        }

        public async Task SetActiveStyle(String styleJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("setActiveStyle", styleJson);
        }

        public async Task SetActiveProp(String propJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("setActiveProp", propJson);
        }

        public async Task RemoveItem(String itemJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("removeItem", itemJson);
        }

        public async Task CanvasFill(String colorJson)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("canvasFill", colorJson);
        }

        public async Task OnConnect(String message)
        {
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("onConnect", message);
        }

        public override async Task OnDisconnectedAsync(Exception ex) 
        {
            String message = "User disconnected from our editor app\nLet's say goodbye";
            await Clients
                .AllExcept(new List<String>() {Context.ConnectionId})
                .InvokeAsync("onDisconnect", message);
            await base.OnDisconnectedAsync(ex);
        }
    }
}