Update 27.02:

1. Edited exhibitions.list.tpl to match the design in figma:
- Added a `flex-container` class to contain elements in the `<a>`
- Moved the `<h3>` element between the divs
2. Edited exhibitions.article.tpl:
- I added `exhibition-txt` class to move the text and match the design in figma
- make sure to add the images
- added a `date-location` div to display the date and location in one line
- added `sisukord-container` div to contain the buttons in `exhibitions.article.contents.tpl`
- added 2 divs: `artist-details, price-status` in `exhibitions.article.artworks.pic.tpl`
- added div `line` to create lines in the page
3. Issues:
- I do not know how to make the gradient with css over the button without changing the JS code. Please help.
- Is it possible to add a class named `image-container` to contain all of the `<figure>` in one div?
- On chrome, the `file_wide img` breaks the site when I change the Responsive size
- I added 3 new social media pngs but in `exhibitions.article.tpl` I can't directly add the social media,
here is a snippet of how it should look like:
```
<div class="social">
	<div class="exhibition-txt">Näitus</div>
	<!-- make sure to add the icons in the server too in gfx folder-->
	<div class="socialmedia"><span>Jälgi meid:</span> <a href="#" target="_blank"><img src="part%202%20galerii_files/article.socialmedia.fb.png" alt="Facebook"></a><a href="#" target="_blank"><img src="part%202%20galerii_files/article.socialmedia.linkedin.png" alt="LinkedIn"></a><a href="#" target="_blank"><img src="part%202%20galerii_files/article.socialmedia.x.png" alt="X"></a><a href="#" target="_blank"><img src="part%202%20galerii_files/article.socialmedia.mail.png" alt="mail"></a><a href="#" target="_blank"><img src="part%202%20galerii_files/article.socialmedia.link.png" alt="copy link"></a></div>
</div>
```

- In `exhibitions.tpl` there is `{$articles}` I don't know where to edit `{$articles}` html template. I uploaded the 2 edited html pages on github, and the css file too.

Update 19.02:

1. I removed the class `section-title` and edit `index.css` to match the example from http://haus.ee.klient.veebimajutus.ee/
2. Fixed the arrow issue, I added the css that you suggested.
3. Fixed. Now `<header>` is the first element before `<div>`
4. Button is now responsive, removed `display: flex;`. I added `display: inline-block; max-width: 300px;` and padding.

I have updated the site to correspond to the example one, with `index.css` and `index.html`


Update 18.02:

1. Fixed `<a>` button element and added a global variable for the button borders
2. Fixed underline issue on mobile view for "Kureeritud kollektsioonid"
3. There was an issue where if the text paragraph was too long it would resize the images, now fixed.

Regarding the design: In the current version I made the subtext gray because I think it fits the website better.