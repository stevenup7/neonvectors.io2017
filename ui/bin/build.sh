
# build sass (builds to dist)
npm run build-sass

# remove any temp build files
rm -rf ./src/html/content/blogs/.blogoutput

# build sass (builds to dist)
npm run build-blogs

# move the built blogs to the server
rm -rf ../server/data/blog
mv ./src/html/content/blogs/.blogoutput ./../server/data/blog

# copy in views ejs
cp -r ./src/html/* ./../server/views

# copy in the javscript
cp ./src/js/*.js ./../server/public/js
cp ./node_modules/vue/dist/vue.min.js ./../server/public/js/vue.min.js
