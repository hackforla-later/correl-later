mysql-server:
  pkg.installed:
    - names:
      - mysql-server
      - python-mysqldb

mysql-config-bind:
  file.replace:
    - name: /etc/mysql/my.cnf
    - pattern: 'bind-address\s*\=\s*127.0.0.1'
    - repl: 'bind-address = 0.0.0.0'
    - backup: False
    - require:
      - pkg: mysql-server

mysql-config-prefix:
  file.append:
    - name: /etc/mysql/my.cnf
    - text: 'innodb_large_prefix = 1'
    - require:
      - pkg: mysql-server

mysql:
  service:
    - running
    - restart: True
    - enable: True
    - require:
      - pkg: mysql-server
      - pkg: python-mysqldb
    - watch:
      - file: mysql-config-bind
      - file: mysql-config-prefix

database-setup:
  mysql_user.present:
    - host: '%'
    - name: {{ pillar['mysql']['username'] }}
    - password: {{ pillar['mysql']['password'] }}
    - require:
      - pkg: python-mysqldb
      - service: mysql

  mysql_database.present:
    - name: {{ pillar['mysql']['dbname'] }}
    - require:
      - mysql_user: database-setup

  mysql_grants.present:
    - grant: ALL
    - database: '*.*'
    - user: {{ pillar['mysql']['username'] }}
    - host: '%'
    - require: 
      - mysql_database: database-setup

