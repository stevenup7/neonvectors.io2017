
# build sass (builds to dist)
npm run build-sass

# make directories we need
if [ ! -d ../server/public/js ]; then
    echo "making directory"
    mkdir ../server/public/js
fi

if [ ! -d ../server/data ]; then
    echo "making directory"
    mkdir ../server/data
fi


# copy scripts across from src
cp ./src/js/*.js ./../server/public/js

# copy the libs across
cp ./node_modules/vue/dist/vue.min.js ./../server/public/js/
cp ./node_modules/d3/build/d3.min.js ./../server/public/js/

# build blogs
#  1. remove any temp build files
rm -rf ./src/blogs/.blogoutput
#  2. build the json files
npm run build-blogs
#  3. move the built blogs to the server
rm -rf ../server/data/blog
mv ./src/blogs/.blogoutput ./../server/data/blog


# build viz
#  1. remove any temp build files
rm -rf ./src/viz/*.json
#  2. build the json files
npm run build-viz
#  3. move the built blogs to the server
rm -rf ../server/data/viz
cp -r ./src/viz ./../server/data/
#  4. now find all the js files in the dataviz folder
#     and put them into public/js so they can be served by nginx
find ../server/data/viz/ -name *.js -exec mv '{}' ../server/public/js/ \;

# copy in views ejs
cp -r ./src/html/* ./../server/views
