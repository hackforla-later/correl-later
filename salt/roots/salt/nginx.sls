nginx:
  pkg:
    - installed
  service:
    - running
    - enable: True
    - watch:
      - file: /etc/nginx/sites-enabled/*
      - file: /etc/nginx/ssl/*
    - require:
      - pkg: nginx

/etc/nginx/sites-enabled/project.conf:
  file.managed:
    - source: salt://conf/nginx-project.conf
    - user: root
    - mode: 755
    - template: jinja
    - require:
      - pkg: nginx
        
default-nginx:
  file.absent:
    - name: /etc/nginx/sites-enabled/default
    - require:
      - pkg: nginx

www-data:
  user.present:
    - require:
      - pkg: nginx

/etc/nginx/uwsgi_params:
  file.managed:
    - source: salt://conf/uwsgi_params
    - user: www-data
    - group: www-data
    - mode: 755
    - require:
      - pkg: nginx

/etc/nginx/sites-available:
  file.directory:
    - user: root
    - mode: 755
    - require:
      - pkg: nginx

/etc/nginx/sites-enabled:
  file.directory:
    - user: root
    - mode: 755
    - require:
      - pkg: nginx
      
/etc/nginx/ssl/self-ssl.crt:
  file.managed:
    - source: salt://certs/self-ssl.crt
    - makedirs: True
    - user: root
    
/etc/nginx/ssl/self-ssl.key:
  file.managed:
    - source: salt://certs/self-ssl.key
    - makedirs: True
    - user: root
    
