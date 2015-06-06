uwsgi-packages:
  pkg.installed:
    - names:
      - python-dev
      - python-pip

uwsgi:
  pip.installed:
    - pkgs:
        uwsgi
    - require:
      - pkg: python-dev
      - pkg: python-pip

/etc/uwsgi/vassals:
  file.directory:
    - user: www-data
    - group: www-data
    - makedirs: true
    - require:
      - pip: uwsgi
      - pkg: nginx
      
/etc/uwsgi/vassals/uwsgi.ini:
  file.managed:
    - source: salt://conf/uwsgi.ini
    - template: jinja
    - require:
      - pip: uwsgi
      
/etc/init/uwsgi.conf:
  file.managed:
    - source: salt://conf/uwsgi.conf
    - template: jinja
    - require:
      - pip: uwsgi
      
uwsgi-service:
  service.running:
    - enable: True
    - name: uwsgi
    - watch:
      - file: /etc/uwsgi/vassals
    - require:
      - file: /etc/init/uwsgi.conf
      
/var/log/uwsgi:
  file.directory:
    - user: www-data
    - group: www-data
    - makedirs: true
    - require:
      - pip: uwsgi
      - pkg: nginx
        
/var/log/uwsgi/emperor.log:
  file.managed:
    - user: www-data
    - group: www-data
    - require:
      - pip: uwsgi
      - pkg: nginx