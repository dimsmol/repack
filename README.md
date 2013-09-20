# repacker

Repacks an object to another representation. Useful for preparation of data got from db.

Example:

```js
var img = restruct({
	img: {
		url: 'image_url',
		origSize: {
			x: 'image_orig_width',
			y: 'image_orig_height'
		}
	}
});

var abc = repacker(
	restruct({ name: 'title' }),
	img
);

var result = abc.repack({
	some_field: 1,
	title: 'lala',
	image_url: 'about:blank',
	image_orig_width: 5,
	image_orig_height: 7
});
```

will produce the following:

```js
{
	someField: 1,
	name: 'lala',
	img: {
		url: 'about:blank',
		origSize: {
			x: 5,
			y: 7
		}
	}
}
```

## getSrcKeys()

Gets src keys corresponding to given dst keys:

```js
abc.getSrcKeys('name', 'img', 'extraField');
```

will produce

```js
['title', 'image_url', 'image_orig_width', 'image_orig_height', 'extra_field']
```

Subcomponents can also be used:

```js
abc.getSrcKeys('img.url', 'img.origSize.x');
```

will produce

```js
['image_url', 'image_orig_width']
```

## reverse()

Performs an action reversed to repack()

```js
abc.reverse({
	extraField: 'extra',
	name: 'lala',
	img: {
		url: 'http://example.com/img.jpg'
	}
}
```

will produce:

```js
{
	extra_field: 'extra',
	title: 'lala',
	image_url: 'http://example.com/img.jpg'
}
```

## multi

multi maps fields to several repackers, using field prefixes to choose a correct one:

```js
var result = multi({
	'abc': abc,
	'xyz': repacker(
		rename('q', 'w'),
		skip('l')
	),
	'*': repacker()
}).repack({
	abc__title: 'title',
	xyz__q: 5,
	xyz__l: 'l',
	xyz__some_field: 8,
	no_prefix: true
});
```

will produce the following:

```js
{
	abc: {
		name: 'title'
	},
	xyz: {
		w: 5,
		someField: 8
	},
	noPrefix: true
}
```

## License

MIT
