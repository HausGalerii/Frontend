17.04 Update:

1. I worked on Toimunud and Artists profile page. They are both almost done. I would like access to the next pages so I can work on their css.

   16.04 Update:

1. Today I finished Collections page and Videos page.
1. Artists page has the search field.
1. I started working on the Artists profile page

   13.04 Update:

1. Artists Page is overall finished, the only thing missing is the search box in mobile view.
1. Käesolevad näitused carousel is still lacking the stylizing to make the 2 images have a space between like in the design
1. I worked on the first page for Kunstifilmid. I posted a question on Asana, I am now waiting for Ivar's reply to Karola's response and to the iframe issue.
   https://app.asana.com/0/0/1207067724285266
1. I started working on Kollektsioonid
1. Ivar please give me access to Oksjionid Kord page

   10.04 Update:
   Finished Teenused page.

   09.04 Update:
   I updated the index.css and index.form.css and auth.tpl files.
   The Artists Page is almost complete.

   21.03 Update:

1. > Don't set height on the image, let it grow as much as it needs.
   > Okay, now in web view the image height grows 👍
1. > In the page "Näitused toimunud" all years have the same layout in figma. Your version has later year different.
   > I don't understand, could you please elaborate and add a picture of what you're referring to?
1. I think we should remove the word "Hind"(price in english), it messes up the design
   ![image](https://github.com/HausGalerii/Frontend/assets/117300935/4bb4d5be-be50-484f-a5d3-8c46eb4b6ba8)
1. I added the max-width to some elements in exhibitions page to match the figma layout and design
1. Please help me display only 1 image in carousel in mobile view. Suggested solution:

```
				<script>
				   var groupCount = 2; // Default group count for larger screens
				    if (window.innerWidth <= 1000) {
    				    groupCount = 1; // Set group count for smaller screens
    				}

					axs.sliderLegacy.init("#views",{
						type:'carousel',
						play:false,
						group_count: groupCount,
						prev_lbl:'<img src="{$theme.dir}gfx/slider.arrow.png" alt="<" />',
						next_lbl:'<img src="{$theme.dir}gfx/slider.arrow.png" alt=">" />'
						});
				</script>

```

1. I linked the css file with the other css page.
2. I made the `<select>` element and search look like in the design. There is a weird blue "x" symbol while typing in the `<input>` field.
3. There is a `<div class="sisukord-container">` missing from containing the `<a>` elements on the `Toimunud näitused` site. If you could please tell me which file contains the template for it.

Update 04.03:

1. Updated the footer of the website to fit the figma design.
2. Added icons in SVG format, but the mail and link icon aren't displayed because they are not in the html.
3. Fixed site header `file-wide` image. It was a very tricky problem.

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
