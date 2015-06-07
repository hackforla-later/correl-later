from django.conf.urls import patterns, include, url
from django.contrib import admin
from correlater import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'correlater.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.HomeView.as_view(), name="home"),
)
