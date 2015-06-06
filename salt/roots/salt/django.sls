django-requirements:
  pip.installed:
    - requirements: {{ pillar['django']['requirements'] }}
    - user: root
    - group: root
    - no_chown: True
    - require:
      - pkg: libmysqlclient-dev
      - pkg: python-dev
      - file: /root/.pip/pip.conf
      
/vagrant/fabfile.py:
  file.managed:
    - source: salt://conf/fabfile.py
    - user: vagrant
    - group: vagrant
    - mode: 644
    - template: jinja

/root/.pip/pip.conf:
  file.managed:
    - source: salt://conf/pip.conf
    - user: root
    - group: root
    - makedirs: True
    - mode: 644
    - template: jinja
