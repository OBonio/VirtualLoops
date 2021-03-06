set -ex
# SET THE FOLLOWING VARIABLES
# docker hub username
USERNAME=obonio
# image name
IMAGE=altloops
# ensure we're up to date
#rm -rf www.mylacuna.co.uk
#git clone https://github.com/OBonio/fractals.git www.mylacuna.co.uk
# bump version
docker run --rm -v "$PWD":/app treeder/bump patch
version=`cat VERSION`
echo "version: $version"

# tag it
git add -A
git commit -m "version $version"
git tag -a "$version" -m "version $version"
git push
git push --tags
docker tag $USERNAME/$IMAGE:latest $USERNAME/$IMAGE:$version
# push it
docker push $USERNAME/$IMAGE:latest
docker push $USERNAME/$IMAGE:$version
