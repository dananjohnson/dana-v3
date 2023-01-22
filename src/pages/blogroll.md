---
title: Blogroll
permalink: /blogroll/index.html
---

{% for blog in blogroll.blogs %}
* [{{ blog.title }}]({{ blog.url }})
{% endfor %}