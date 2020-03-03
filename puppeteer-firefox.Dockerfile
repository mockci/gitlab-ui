FROM dev.gitlab.org:5005/gitlab/gitlab-build-images:gitlab-puppeteer

ARG FIREFOX_DOWNLOAD_URL
ARG FIREFOX_DOWNLOAD_SHA256

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_BROWSER firefox
ENV PUPPETEER_EXECUTABLE_PATH /usr/local/bin/firefox

RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/firefox.tar.bz2 $FIREFOX_DOWNLOAD_URL \
  && echo "$FIREFOX_DOWNLOAD_SHA256 /tmp/firefox.tar.bz2" | sha256sum -c - \
  && tar -xvjf /tmp/firefox.tar.bz2 -C /opt \
  && ln -s /opt/firefox/firefox $PUPPETEER_EXECUTABLE_PATH \
  && apt-get update \
  && apt-get install -y libgtk3.0-cil-dev libasound2 libdbus-glib-1-2 libdbus-1-3 \
  && rm -rf /tmp/firefox.* \
  && apt-get autoremove -yq \
  && apt-get clean -yqq \
  && rm -rf /var/lib/apt/lists/* \
  && test -f $PUPPETEER_EXECUTABLE_PATH \
  && test -x $PUPPETEER_EXECUTABLE_PATH \
  && $PUPPETEER_EXECUTABLE_PATH --version
