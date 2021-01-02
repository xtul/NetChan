![logo]

# What is NetChan

NetChan is a frontend for my [NetBoard](https://github.com/xtul/NetBoard) project - an anonymous forum where registration is not required. A live version is available on [https://netchan.nl/](https://netchan.nl/). Same as NetBoard, it is a work-in-progress and many things are subject to change.

Note: Both NetBoard and NetChan are currently undergoing major changes, with redesigns or complete rewrites of certain features.

# Technology

NetChan uses Vue.js 2 as a display layer and Vue CLI as a server.

# Features
### Currently available
 - Reading boards and their pages, threads
 - "Classic" board view
 - "List" board view *(no images, only subjects, last post date etc.)*
 - Quoting *(greentext)*
 - Viewing user-posted images and their thumbnails
 - Frontpage with a board list, welcome info and news
 - Posting images
 - Making threads/posts
 - Posting protected by hCaptcha
 - Your posts are automatically marked
 - Manual and automatic thread updating

### To do
 - Togglable sound effect on new posts
 - Text formatting for higher level posters *(moderators, administrators - needs IS4 in API first)*
 - Basic BBCode-like text formatting for everyone *(such as \[spoiler], \[code])*
 - Deleting posts
 - Administration tools *(API needs proper IS4 implementation)*
 - ...

# Contributing

Any code contribution or issue report is welcome.

Running this project requires Node.js (built on version 12) and Vue CLI.

Open `NetChan` directory in the command line and run `npm run serve` to host a development server. You will also need to create a hardlink to the /wwwroot/img directory of [NetBoard](https://github.com/xtul/NetBoard) binary - in production, a load balancer such as Nginx should handle it.

Additionally you may want to create a fake domain (eg. using hosts on Windows) - hCaptcha refuses to work on localhost.

[logo]: https://raw.githubusercontent.com/xtul/NetBoard/master/NetBoard.Backend/wwwroot/img/logo.png "Logo"
