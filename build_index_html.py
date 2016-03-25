template = None
script = None
style = None
with open('template.html', 'r') as myfile:
    template=myfile.read()
with open('script.js', 'r') as myfile:
    script=myfile.read()
with open('style.css', 'r') as myfile:
    style=myfile.read()

html = template
html = html.replace("[script]", "<script>\n{0}</script>".format(script))
html = html.replace("[style]", "<style>\n{0}</style>".format(style))

with open('index.html', 'w') as myfile:
    myfile.write(html)
