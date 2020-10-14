# NetChan

NetChan is a frontend for my [NetBoard](https://github.com/xtul/NetBoard) project. It is different to NetBoard in that it is stylized - NetChan is a website that will be available once the project is good enough, whereas NetBoard is a generic API provider. Same as NetBoard, it is a work-in-progress and many things are subject to change.

# Technology

NetChan uses Vue.js 2 as a display layer and Webpack as a server.

# Features
### Currently available
 - Reading boards and their pages, threads
 - "Classic" board view
 - Quoting *(greentext)*
 - Viewing user-posted images and their thumbnails
 - Frontpage with a board list, welcome info and news
 - Posting images
 - Making threads/posts
 - Posting protected by hCaptcha
 - Your posts are automatically marked
 - Manual and automatic thread updating

### Partially done
 - Catalog view *(will be replaced by thread list view)*

### To do
 - Thread list view *(no images, only subjects, last post etc.)*
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
