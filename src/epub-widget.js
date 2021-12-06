(function(a,b,c,d) {
  c=a.createElement('script'),
  c.async=1;
  c.src='https://psyreporter.com/epub/epub.js';
  a.head.appendChild(c);

    d = setInterval(function() {
      if (window.epubExport) {
        clearInterval(d);

        if (b) {
          window.epubExport(b);
        }
        
        console.info('ebook epub export widget ready', window.epubExport);
      }
    },10);
})(document,{

});