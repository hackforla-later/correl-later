from fabric.api import *
from fabric import colors
from fabtools.vagrant import vagrant

import os, hashlib

# Local paths
LOCAL_ROOT = os.path.dirname(os.path.realpath(__file__))

# Server paths
PROJECT_PATH = "/vagrant/src"

MANAGE_BIN = "/vagrant/src/manage.py"


def manage_py(command):
    """ Runs a manage.py command on the server """
    with cd("/vagrant/src"):
        run('{python} {manage} {command}'.format(python="/usr/bin/python",
                                                 manage=MANAGE_BIN,
                                                 command=command))

@task
def django_admin(command):
    """ Run a command with django-admin.py at the /vagrant directory.  Useful for creating the new project """
    with cd("/vagrant"):
        run('{django} {command}'.format(django="/usr/local/bin/django-admin.py",
										command=command))

@task
def m(command):
    """ Run a command with manage.py """
    manage_py(command)

@task
def runserver():
    """
    Runs the django server on port 8000
    """
    manage_py("runserver 0.0.0.0:8000")

@task
def syncdb():
    """ Django syncdb command."""
    manage_py("syncdb --noinput")

@task
def migrate():
    """ Django South migrate command."""
    manage_py("migrate")

@task
def collectstatic():
    """ Run collectstatic command. """
    manage_py("collectstatic --noinput")

@task
def uwsgi_restart():
    """
    Restart uwsgi process
    """
    run("kill -HUP $(ps aux | grep -e '[/]uwsgi --emperor' | awk '{print $2}')")

@task
def print_uwsgi_log():
    """
    Prints the last 50 lines of uwsgi log
    """
    run("tail -n 50 /var/log/uwsgi/uwsgi.log")