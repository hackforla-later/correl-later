essential-libs:
  pkg.installed:
    - names:
      - build-essential
      - libmysqlclient-dev
      - python-dev
      - python-pip
      - libldap2-dev
      - libsasl2-dev
      - libssl-dev
      - git

# make sure pip is updated to prevent problems with python-requests
pip:
  pip.installed:
    - name: pip == 6.0.5
    - require:
      - pkg: python-pip