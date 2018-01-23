#!/usr/bin/env python3
import jinja2

def main():

	templateLoader = jinja2.FileSystemLoader(searchpath="./")
	templateEnv = jinja2.Environment(loader=templateLoader)
	TEMPLATE_FILE = "index.jinja"
	template = templateEnv.get_template(TEMPLATE_FILE)
	html = template.render()

	with open('index.html', 'w') as myfile:
		myfile.write(html)

if __name__ == '__main__':
	main()
