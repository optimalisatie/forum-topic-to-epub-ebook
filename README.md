# Forum topic to epub 📖 ebook export

A simple browser widget to export a forum topic to epub ebook.

Tested on:

- [forums.onlinebookclub.org](https://forums.onlinebookclub.org/)
- [onlinephilosophyclub.com](https://onlinephilosophyclub.com/forums/index.php)

## How to use

Step 1: navigate to a forum topic that you want to export, e.g. [https://onlinephilosophyclub.com/forums/viewtopic.php?f=12&t=16848](https://onlinephilosophyclub.com/forums/viewtopic.php?f=12&t=16848).


Step 2: Copy the following browser widget code into the browser console (F12) to start an epub ebook export.

```javascript
(function(b,c,a,d){
   a=b.createElement("script");a.async=1;a.src="https://psyreporter.com/epub/epub.js";b.head.appendChild(a);d=setInterval(function(){window.epubExport&&(clearInterval(d),c&&window.epubExport(c),console.info("ebook epub export widget ready",window.epubExport))},10)
})(document,{
   /* options object */
});
```

#### Browser button

It is possible to create a browser bookmark with the prefix `javascript:` to start the ebook export widget using a button in the browser.

```text
javascript:[...the above widget code here...]
```

## Options

The primary options are:

- `proxy`: `string`
    A CORS proxy to enable remote images to be included in the book. ([free proxy list](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347))
- `pages`: `array`
    An array of page indexes to export into the book, e.g. `[4,5,6]` for pages 4 to 6.
- `cover`: `string`
    Book cover image URL, e.g. `"http://abc.com/book-cover.jpg"`
- `title`: `string`  
    Title of the book
- `author`: `string | string[]` (optional, default `['anonymous']`)  
    Name of the author for the book, e.g. `"Alice"` or `["Alice", "Bob"]`
- `publisher`: `string` (optional, default `anonymous`)  
    Publisher name
- `description`: `string` (optional)  
    Book description
- `css`: `string` (optional)  
    CSS string, to include in book, e.g: `"body{background: #000}"`

### Example with options

```javascript
(function(b,c,a,d){
   a=b.createElement("script");a.async=1;a.src="https://psyreporter.com/epub/epub.js";b.head.appendChild(a);d=setInterval(function(){window.epubExport&&(clearInterval(d),c&&window.epubExport(c),console.info("ebook epub export widget ready",window.epubExport))},10)
})(document,{
   cover: "https://onlinephilosophyclub.com/forums/download/file.php?avatar=39661_1389361593.jpg",
   pages: [10,11,12,13,14,15]
});
```

![On the absurd hegemony of science - An ebook by [USERNAME]](https://github.com/optimalisatie/forum-topic-to-epub-ebook/blob/main/example-ebook.png?raw=true)

### API

When an options object is passed as the second argument of the widget code, it will instantly start an ebook export for the active forum topic. Without it, the API `epubExport` can be used manually.

```javascript
window.epubExport({ /* options object */);
```