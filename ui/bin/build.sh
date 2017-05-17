
# copy in views ejs
cp -r ./src/html/* ./../server/views

#b uild sass (builds to dist)
npm run build-sass

# copy in the javscript
cp ./src/js/vectorize.js ./../server/public/js
cp ./node_modules/vue/dist/vue.min.js ./../server/public/js/vue.min.js
