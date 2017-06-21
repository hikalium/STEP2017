# binrel

First, place your `wikipedia_links` directory under here.
```
04_graph/
    wikipedia_links/
        links.txt
        pages.txt
```
and run `make`.

Second, generate binary formatted link file.
```
./txt2bin wikipedia_links/links.txt wikipedia_links/links.bin
```

And run `binrel`!
```
./binrel wikipedia_links/links.bin wikipedia_links/pages.txt
```
