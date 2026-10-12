import pymupdf
out=pymupdf.open()
for f in ['_cover.pdf','_body.pdf']:
    out.insert_pdf(pymupdf.open(f))
out.set_metadata({'title':'Low Desert Engine: a field guide',
  'subject':'How the Low Desert Motel is built, and how to build other 3D worlds on the same engine',
  'author':'Low Desert Motel project','creator':'Chromium (HTML print)'})
out.save('Low-Desert-Engine-Guide.pdf', garbage=3, deflate=True); print('pages',out.page_count)
