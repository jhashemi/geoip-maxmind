FROM centos:centos6

### YUM
RUN rpm --import http://mirror.centos.org/centos/RPM-GPG-KEY-CentOS-6 \
    && rpm --import http://dl.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-6 \
    && rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm \
    && rpm --nosignature -i https://repo.varnish-cache.org/redhat/varnish-4.0.el6.rpm

RUN yum -y install \
    supervisor \
    varnish \
    tar \
    git \
    gunzip \
    npm \
    hitch 

RUN rm -rf /var/cache/yum/* && yum clean all

## JS APP
RUN mkdir /usr/local/share/GeoIP/ && cd /usr/local/share/GeoIP/ && curl -O "http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz" 2>&1 && gunzip GeoLite2-City.mmdb.gz
RUN cd /opt/ && git clone https://github.com/supermasita/geoip-maxmind.git
RUN cd /opt/geoip-maxmind && npm install mmdb-reader && npm install pm2 -g   

## Varnish
COPY default.vcl /etc/varnish/default.vcl

## SUPERVISOR CONF
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

## Ports
EXPOSE 80 8080 6084 443

## RUN, FORREST! RUN!
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
