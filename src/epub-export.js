/*
blockquote {
    background-color: #EBEADD;
    border-color: #DBDBCE;
    border: 1px solid transparent;
    font-size: 0.95em;
    margin: 1em 1px 1em 25px;
    overflow: hidden;
    padding: 5px;
}
blockquote blockquote {
    background-color: #EFEED9;
    font-size: 1em;
    margin: 1em 1px 1em 15px;
}
*/
// url
// url_escaped
var default_cors_proxy = 'https://api.codetabs.com/v1/proxy/?quest={{url}}';
var default_ebook_options = {
  tocXHTML: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="<%- lang %>" lang="<%- lang %>">
<head>
    <title><%= title %></title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
    <h1 class="topic-head"><%= title %></h1>
    <p class="topic-date-author">Discussion started on <span class="topic-date"><%= topic_date %></span> by <span class="topic-author"><%= author %></span></p>
    <p class="topic-url"><a href="<%= url %>"><%= url %></a></p>
    <% if (page_selection) { %>
      Pages: <%= page_selection.join(",") %>
    <% } %>

    <% if (cover) { %>
      <img src="cover.<%= cover.extension %>" />
    <% } %>

    <h2 class="h1"><%= tocTitle %></h2>
    <nav id="toc" epub:type="toc">
        <% if (numberChaptersInTOC){ %>
            <ol>
        <% }else{ %>
            <ol style="list-style: none">
        <% } %>
            <% content.forEach(function(content, index){ %>
                <% if(!content.excludeFromToc){ %>
                    <li class="table-of-content">
                        <a href="<%= content.filename %>"><% if(content.date){ %><span class="toc-date"><%= content.date %></span> - <% }%><% if(content.author.length){ %><span class="toc-author"><%= content.author.join(",") %></span> - <% }%><span class="toc-title"><%= content.title %></span></a>
                    </li>
                <% } %>
            <% }) %>
        </ol>
    </nav>

    <p>Ebook created by 📖 <a href="https://github.com/optimalisatie/forum-topic-to-epub-ebook">forum-topic-to-epub-ebook</a> browser widget.</p>
</body>
</html>`,
chapterXHTML: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="<%= lang %>" lang="<%= lang %>">
<head>
  <meta charset="UTF-8" />
  <title><%= title %></title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <% if (prependChapterTitles) { %>
    <h1 class="epub-head"><%= title %></h1>
    <% if (date) { %>
      <p class="epub-date"><%= date %></p>
    <% } %>
    <% if (author.length) { %>
      <p class="epub-author"><%= author.join(', ') %></p>
    <% } %>
    <% if (url) { %>
      <p class="epub-link"><a href="<%= url %>"><%= url %></a></p>
    <% } %>
  <% } %>
  <%- content %>
</body>
</html>`,
  css: `
  ol {
    padding-inline-start:3em;
  }
.epub-author {
    margin: 0;
    padding: 0;
}
.epub-head {
  font-size: 1.2em;
}
.epub-date {
    float: right;
    margin: 0;
    padding: 0;
}
.epub-link {
      margin-top: 10px;
    border-top: solid 1px #666;
    padding-top: 5px;
    margin-bottom: 30px;
}
.epub-link a {
  color:#666;
    font-size: 90%;
}
.toc-title {
    font-size: 80%;
      font-style: italic;
}
.toc-link {
    color: #999;
    font-size: 85%;
    display: block;
}
.topic-url {
      margin-top: 10px;
    font-size: 90%;
}
.topic-date-author {
      margin: 0;
    margin-top: 10px;
}
.topic-date {
  font-style:italic;
}
.topic-author {
  font-weight: bold;
}
.topic-head {
      margin-bottom: 0;
}
hr {
    border: 0;
    border-bottom: 1px solid #dedede;
    margin: 60px 10%;
}
blockquote {
    background-color: #f7f7f7;
    border-color: #efefef;
    border: 1px solid transparent;
    font-size: 0.95em;
    margin: 1em 1px 1em 25px;
    overflow: hidden;
    padding: 5px;
        margin-left: 10px;
}
blockquote blockquote {
    background-color: #f1f1f1;
    font-size: 1em;
    margin: 1em 1px 1em 15px;
        margin-left: 10px;
}
blockquote cite {
    font-style: normal;
    font-weight: bold;
    display: block;
    font-size: 0.9em;
    margin-bottom: 5px;
}
blockquote cite > span {
    float: right;
    font-weight: normal;
}
.text-italics {
    font-style: italic;
}
.text-strong {
    font-weight: bold;
}
.signature {
    border-top-color: #CCCCCC;

    margin-top: 1.5em;
    padding-top: 0.2em;
    font-size: 1.1em;
    border-top: 1px solid transparent;
        border-top-color: transparent;
    clear: left;
    line-height: 140%;
    overflow: hidden;
    width: 100%;
}
.signature a, .signature a:hover {
    background-color: transparent;
    border: none;
    text-decoration: underline;
}
  `
};

function PROXY(url, proxy) {
  return proxy
    .replace('{{url}}', url)
    .replace('{{url_escaped}}', escape(url));
}

function ERROR(err, alert_msg) {
  if (!(err instanceof Array)) {
    err = [err];
  }
  console.error.apply(null,err);

  if (alert_msg) {
    alert((typeof alert_msg === 'string') ? alert_msg : err.join(' | '));
  }
}

var IFRAMES = [];
async function LOAD_PAGE(url) {
  return await new Promise(async function(resolve,reject) {

    var IFRAME_ID = IFRAMES.length;
    var iframe = document.createElement('iframe');
    iframe.name = 'epub-frame-' + IFRAME_ID;
    iframe.id = 'epub-frame-' + IFRAME_ID;

    IFRAMES[IFRAME_ID - 1] = iframe;

    document.body.appendChild(iframe);

    var d = (iframe.contentWindow || iframe.contentDocument);
    if (d.document) {
        d = d.document;
    }

    var html;
    try {
      var response = await fetch(url);
      html = await response.text();
    } catch(err) {
      return ERROR(err);
    }

    // content security policy
    var csp = {}, meta = '';

    // enable default permissions for code execution container
    csp['script-src'] = " 'none'";
    csp['style-src'] = " 'none'";
    csp['frame-src'] = " 'none'";

    // construct meta
    meta = '<meta http-equiv=Content-Security-Policy content="';
    for (var rule in csp) {
        if (csp.hasOwnProperty(rule)) {
            meta += rule + ' ' + csp[rule] + ';';
        }
    }
    meta += '">';

    // execute code
    d.open();
    d.write(html.replace(/<head(\s[^>]*|\/)?>/i,'$1' + meta));
    d.close();

    setTimeout(function() {
      resolve(d);
    },500);

  });
}

var A = document.createElement('a');
function PARSE_URL(url) {
  var link = A.cloneNode(true);
  link.href = url;
  return link.href;
}

function QUERY_POSTS(dom, proxy) {

  var posts = [];
  var els = dom.querySelectorAll('.post');

  els.forEach(function(el) {
    var post = {};

    post.author = el.querySelector('.username,.username-coloured').innerHTML;
    post.date = new Date(el.querySelector('time[datetime]').getAttribute('datetime')).toUTCString().replace(/^[^,]+,\s*([^:]+[0-9]{2}:[0-9]{2}).*$/,'$1');
    post.url = el.querySelector('.author > a > span').parentElement.href;
    
    post.title = el.querySelector('h3 > a').innerHTML;
    //+ post.author + ' | '
    var content = el.querySelector('.content');

    // sanitize local URLs 
    content.querySelectorAll('a').forEach(function(el) {
      el.href = el.href;
    });
    content.querySelectorAll('[src]').forEach(function(el) {
      el.src = PARSE_URL(el.src);
    });
    if (proxy) {
      content.querySelectorAll('img').forEach(function(el) {
        el.src = PROXY(el.src, proxy);
      });
    }

    post.content = content.innerHTML;

    posts.push(post);
  });

  return posts;
}

function PAGINATION_LINKS(dom, pages, page_urls) {
  var todo = [];
  var ul = dom.querySelector('.pagination ul');
  if (ul) {
    ul.querySelectorAll('li a[href*="viewtopic.php"]').forEach(function(el) {
      var href = el.href;
      if (page_urls.indexOf(href) === -1) {
        page_urls.push(href);

        todo.push(
          new Promise(async function(resolve, reject) {
            var dom = await LOAD_PAGE(href);
            pages.push([
              href,
              dom
            ]);
            resolve();
          })
        );
      }
    });
  }
  return todo;
}


async function EPUB_EXPORT(config) {

  if (!config || typeof config !== 'object') {
    config = {};
  }

  console.info('generating epub ebook', 'config:', config);

  var epub_options = Object.assign({}, default_ebook_options, {
    tocTitle: 'Posts'
  }, config);

  // verify environment
  var location_url = document.location.href;

  if (!location_url) {
    return ERROR('location URL not detected', true);
  }

  if (!/viewtopic\.php/.test(location_url)) {
   return ERROR('only URLs with "viewtopic.php" (PHPBB) are supported', true); 
  }

  var proxy = config.proxy || default_cors_proxy;

  // publisher
  epub_options.publisher = config.publisher || document.querySelector('meta[property="og:site_name"]').getAttribute('content') + ' ('+document.location.hostname+')';

  // topic title
  var topic_title = document.querySelector('.topic-title a');
  if (!topic_title) {
    return ERROR('no topic title found on page', true); 
  }
  location_url = topic_title.href;

  var first_page = location_url.replace(/\&start=\d+(\&|$)/i,'');

  epub_options.title = config.title || topic_title.innerHTML;
  console.log(epub_options.title, 12244)

  var pages = [], pages_done = [], page_urls = [];

  console.groupCollapsed('Loading pages...');

  // parse pagination links
  var todo = PAGINATION_LINKS(document, pages, page_urls);

  if (todo.length) {
    await Promise.all(todo);
  }

  // load first page dom
  var dom;
  if (page_urls.indexOf(first_page) === -1) { 
    dom = await LOAD_PAGE(first_page);
    pages.push([
      first_page,
      dom
    ]);
    page_urls.push(first_page);

  } else {
    pages.forEach(function(page) {
      if (page[0] === first_page) {
        dom = page[1];
      }
    });
  }

  var p_len = 0;
  while (p_len !== pages.length) {
    p_len = pages.length;

    pages.forEach(function(page) {

      // parse pagination links
      var _todo = PAGINATION_LINKS(page[1], pages, page_urls);
      todo = todo.concat(_todo);
    });

    if (todo.length) {
      await Promise.all(todo);
    }

    // continue when new pages are added
  }

  console.groupEnd();

  // sort pages by start=
  var start_re = /start=(\d+)(\&|$)/i;
  var _urls = page_urls.slice(0);
  pages.sort(function(a,b) {
    var a_start = a[0].match(start_re);
    var b_start = b[0].match(start_re);
    if (a_start && !b_start) {
      return  1;
    } else if (!a_start && b_start) {
      return -1;
    } else if (a_start && b_start) {
      return parseInt(a_start[1]) - parseInt(b_start[1]);
    } else {
      return 0;
    }
  });
  page_urls = [];
  pages.forEach(function(page) {
    page_urls.push(page[0]);
  });

  epub_options.url = pages[0][0];

  console.info('downloading and parsing page...', pages[0][0]);
  dom = pages[0][1];

  var topic_author = dom.querySelector('.post .username').innerHTML;
  var topic_date = new Date(dom.querySelector('.post time[datetime]').getAttribute('datetime'));

  epub_options.author = topic_author;
  epub_options.topic_date = topic_date.toUTCString().replace(/^[^,]+,\s*([^:]+[0-9]{2}:[0-9]{2}).*$/,'$1');

  var chapters = [];

  var posts = [];
  var page_selection = (config.pages && config.pages instanceof Array) ? config.pages : false;
  if (page_selection) {
    epub_options.page_selection = page_selection;
  } else {
    epub_options.page_selection = false;
  }

  var page, _posts, count = 0;
  while (page = pages.shift()) {

    if (page_selection && page_selection.indexOf(count + 1) === -1) {
      count++;
      continue;
    }
    count++;
    
    _posts = QUERY_POSTS(page[1], proxy);

    posts = posts.concat(_posts);
  }

  if (epub_options.cover) {
    epub_options.cover = PROXY(epub_options.cover, proxy);
  }

  var slug = epub_options.title.toLowerCase().replace(/[^a-z0-9\_\-]+/ig,'-').replace(/^-+/g,'').replace(/-+$/g,'').trim();

  console.info('generating epub ebook...', slug + '.epub');

  new epubGen.default(epub_options, posts).then(
    function(content) {
      console.log('epub ebook generated', slug + '.epub', content);

        /*var blob = new Blob([content], {
            type: "application/epub+zip"
        });*/
        
        saveAs(content, slug + '.epub');

    },
    function(err){ console.error("Failed", err) }
  );

}

window.epubExport = async function(config) {
  return await EPUB_EXPORT(config);
}
