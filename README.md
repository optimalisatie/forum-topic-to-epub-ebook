# Forum topic to epub 📖 ebook export

A simple browser widget to export a forum topic to `.epub` ebook.

Tested on:

- [forums.onlinebookclub.org](https://forums.onlinebookclub.org/)
- [onlinephilosophyclub.com](https://onlinephilosophyclub.com/forums/index.php)

_(first version for PHPBB forums)_

## How to use

Step 1: navigate to a forum topic that you want to export, e.g. [https://onlinephilosophyclub.com/forums/viewtopic.php?f=12&t=16848](https://onlinephilosophyclub.com/forums/viewtopic.php?f=12&t=16848).


Step 2: Copy the following browser widget code into the browser console (F12) to start an `.epub` ebook export.

```javascript
(function(b,c,a,d){
   a=b.createElement("script");a.async=1;a.src="https://psyreporter.com/epub/epub.js";b.head.appendChild(a);d=setInterval(function(){window.epubExport&&(clearInterval(d),c&&window.epubExport(c),console.info("ebook epub export widget ready",window.epubExport))},10)
})(document,{
   /* options object */
});
```

#### Browser button

It is possible to create a browser bookmark button with the prefix `javascript:`. The button will create an ebook for the forum topic that is visible in the browser.

```text
javascript:[...the above widget code here...]
```

## Options

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

### Example options

```json
{
   "proxy": "https://api.codetabs.com/v1/proxy/?quest={{url}}",
   "cover": "https://onlinephilosophyclub.com/forums/download/file.php?avatar=39661_1389361593.jpg",
   "pages": [14,15,16],
   "title": "A selection of forum posts to read..."
}
```

### Example browser widget with options

```javascript
(function(b,c,a,d){
   a=b.createElement("script");a.async=1;a.src="https://psyreporter.com/epub/epub.js";b.head.appendChild(a);d=setInterval(function(){window.epubExport&&(clearInterval(d),c&&window.epubExport(c),console.info("ebook epub export widget ready",window.epubExport))},10)
})(document,{
   cover: "https://onlinephilosophyclub.com/forums/download/file.php?avatar=39661_1389361593.jpg",
   pages: [10,11,12,13,14,15]
});
```

### API

Without passing an options object to the special browser widget code, the API `epubExport` can be used manually. It is also possible to load `epub.js` manually, for example for a custom forum integration.

```javascript
window.epubExport({ /* options object */);
```

# 📖 Ebook demo

The discussion topic [On the absurd hegemony of science](https://onlinephilosophyclub.com/forums/viewtopic.php?f=12&t=16848) with over 1000 posts was printed into an ebook in several seconds, including all images embedded.

![On the absurd hegemony of science - An ebook by [USERNAME]](https://github.com/optimalisatie/forum-topic-to-epub-ebook/blob/main/example-ebook.png?raw=true)

### Download ebook

A demo `.epub` ebook is available in this repository.

Forum discussion: [on-the-absurd-hegemony-of-science.epub](https://github.com/optimalisatie/forum-topic-to-epub-ebook/blob/main/on-the-absurd-hegemony-of-science.epub?raw=true)

Poetry book review: [official-review-in-the-land-of-myth-by-bernard-kuckuck.epub](https://github.com/optimalisatie/forum-topic-to-epub-ebook/blob/main/official-review-in-the-land-of-myth-by-bernard-kuckuck.epub?raw=true)