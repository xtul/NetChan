# NetChan

NetChan is a frontend for my [NetBoard](https://github.com/xtul/NetBoard) project. As NetBoard, it is a work-in-progress and many things are subject to change.

# Technology

NetChan uses Vue.js 2 as a display layer and Webpack as a server.

# Features
### Currently available
 - Reading boards and their pages, threads
 - "Classic" and Catalog board view
 - Quoting *(greentext)*
 - Viewing user-posted images and their thumbnails
 - Frontpage with a board list and 

### Partially done
- Making threads/posts
- Posting images

### To do
- Deleting posts
- Administration panel
- Captcha
- ...

# Running

Running this project requires Node.js (built on version 12) and Vue CLI.

Open `ClientApp` directory in the command line and run `npm run serve` to host a development server. You will also need to create a hardlink to the /wwwroot/img directory of [NetBoard](https://github.com/xtul/NetBoard) binary - in production, a load balancer such as Nginx should handle it.