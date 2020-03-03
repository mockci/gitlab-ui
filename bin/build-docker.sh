#!/usr/bin/env sh

set -e

# Nightly URL below, TODO: use a real release once up:
FIREFOX_DOWNLOAD_URL="https://ftp.mozilla.org/pub/firefox/nightly/2020/03/2020-03-07-09-32-21-mozilla-central/firefox-75.0a1.en-US.linux-x86_64.tar.bz2"
#FIREFOX_VERSION=74.0b9
#FIREFOX_DOWNLOAD_URL="https://ftp.mozilla.org/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2"
FIREFOX_DOWNLOAD_SHA256="320357550241e5b802b68da60873ffd901e71b3f9e36a124ebfc9975b48ae84c"
FIREFOX_IMAGE=${PUPPETEER_FIREFOX_IMAGE:-puppeteer-firefox:$PUPPETEER_VERSION}

# Chrome's version is tied to puppeteer
CURRENT_PUPPETEER_VERSION=$(grep '^puppeteer@' -A 1 yarn.lock | grep 'version' | sed 's#.*"\(.*\)".*#\1#')
CHROME_IMAGE=${PUPPETEER_CHROME_IMAGE:-puppeteer-chrome:$PUPPETEER_VERSION}

echo "puppeteer version: $PUPPETEER_VERSION"

if ! [ "$CURRENT_PUPPETEER_VERSION" = "$PUPPETEER_VERSION" ]; then
    echo "The puppeteer version in .gitlab-ci.yml ($PUPPETEER_VERSION) and yarn.lock ($CURRENT_PUPPETEER_VERSION) do not match"
    echo "Please ensure that they both have the same value!"
    exit 1
fi


build_chrome_docker() {
  BASE_IMAGE=dev.gitlab.org:5005/gitlab/gitlab-build-images:gitlab-puppeteer
  GLOBAL_DIR=$(docker run --rm $BASE_IMAGE yarn global dir)
  CHROMIUM_REVISION=$(docker run --rm $BASE_IMAGE yarn info --silent "puppeteer@$PUPPETEER_VERSION" puppeteer.chromium_revision)

  CHROMIUM_EXECUTABLE_PATH="$GLOBAL_DIR/node_modules/puppeteer/.local-chromium/linux-$CHROMIUM_REVISION/chrome-linux/chrome"

  echo "chromium revision: $CHROMIUM_REVISION"
  echo "executable dir: $CHROMIUM_EXECUTABLE_PATH"

  docker build . \
    --file puppeteer-chrome.Dockerfile \
    --build-arg "PUPPETEER_VERSION=$PUPPETEER_VERSION" \
    --build-arg "EXECUTABLE_PATH=$CHROMIUM_EXECUTABLE_PATH" \
    --tag "$CHROME_IMAGE"

  echo "Everything is fine, we are pushing"

  docker push "$CHROME_IMAGE"
}

build_firefox_docker() {

  echo "Installing Firefox version: $FIREFOX_VERSION"

  docker build . \
    --file puppeteer-firefox.Dockerfile \
    --build-arg "FIREFOX_DOWNLOAD_URL=$FIREFOX_DOWNLOAD_URL" \
    --build-arg "FIREFOX_DOWNLOAD_SHA256=$FIREFOX_DOWNLOAD_SHA256" \
    --tag "$FIREFOX_IMAGE"

  echo "Everything is fine, we are pushing"

  docker push "$FIREFOX_IMAGE"
}

if docker manifest inspect "$FIREFOX_IMAGE" 2> /dev/null > /dev/null; then
    echo "Docker image $FIREFOX_IMAGE already exists"
else
    echo "Building target image $FIREFOX_IMAGE"
    build_firefox_docker
fi

if docker manifest inspect "$CHROME_IMAGE" 2> /dev/null > /dev/null; then
    echo "Docker image $CHROME_IMAGE already exists"
else
    echo "Building target image $CHROME_IMAGE"
    build_chrome_docker
fi

