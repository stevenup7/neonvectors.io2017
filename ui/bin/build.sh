
# build sass (builds to dist)
npm run build-sass

# build sass (builds to dist)
npm run build-blogs

# move the built blogs to the server
mv .src/html/content/blogs/.blogoutput ./../server/data/blogs

# copy in views ejs
cp -r ./src/html/* ./../server/views

# copy in the javscript
cp ./src/js/vectorize.js ./../server/public/js
cp ./node_modules/vue/dist/vue.min.js ./../server/public/js/vue.min.js
