export default {
  strict: false,
  namespaced: true,

  state() {
    return {
      allRecipes: [],
      filterActive: false,
      filterCache: [], //used to store a copy of the current 'allRecipes' state before applying a filter; to be restored into 'allRecipes' when clearing filter selection
      filterData: {},
      recipeCategory: [
        'Bread',
        'Salad',
        'Dessert',
        'Drink',
        'Main',
        'Snack',
        'Soup',
        'Pastry'
      ],
      recipeDiet: [
        'Keto',
        'Vegetarian',
        'Vegan',
        'Other'
      ]
    }
  },

  getters: {
    allRecipes: state => state.allRecipes,
    filterActive: state => state.filterActive,
    filterCache: state => state.filterCache,
    filterData: state => state.filterData,
    recipeCategory: state => state.recipeCategory,
    recipeDiet: state => state.recipeDiet
  },

  mutations: {
    SET_ALL_RECIPES(state, value) {
      state.allRecipes = value;
    },
    SET_FILTER_STATE(state, value) {
      state.filterActive = value;
    },
    SET_FILTER_CACHE(state, value) {
      state.filterCache = value;
    },
    SET_FILTER_DATA(state, value) {
      state.filterData = value;
    },
  },

  actions: {
    /**
    * @param args - an array provided by 'RecipeFilter.vue' that provides input for 'mode' in [0] and 'selection' in [1]
    */
    applyFilter({ commit, getters}, args) {
      const fState = getters.filterActive;
      const fData = getters.filterData;
      const recipes = getters.allRecipes;
      const fromCache = getters.filterCache;

      let filtered = new Array;
      let mode = args[0].toLowerCase(); // strig value
      let selection = args[1].map(item => item.toLowerCase()); //array based on 'RecipeFilter.vue' component state; lowercased just to make sure

      //format the data for filtering
      let currentFilterData = Object.assign(fData, { [mode]: selection });
      //commit the filter settings
      commit('SET_FILTER_DATA', currentFilterData);

      const findIndex = (arr, el) => {
        if(arr !== undefined) {
          if(arr.length === 0) {
            return 0;
          } else {
            return arr.indexOf(el);
          }
        } else { return -1 }
      }

      const doFilter = (input) => {
        let result = new Array;
        let fDataLength = Object.keys(fData).length;

        result = input.filter((item) => {
          //prepare the data
          let cat = findIndex(fData.category, item.category.toLowerCase());
          let dt = findIndex(fData.diet, item.diet.toLowerCase());
          //handle the possibilities
          switch(fDataLength) {
            case 2:
              // fDataLength = 2 -- BOTH conditions are set
              if(cat !== -1 && dt !== -1) {
                return true
              }
              break;

            case 1:
              // fDataLength = 1 -- ONE condition is set
              if(cat !== -1 || dt !== -1) {
                return true
              }
              break;

            default:
              return false;
          }
        });
        //return the filtered array
        return result;
      };

      if(!fState) {
        //if there is NO active filter
        commit('SET_FILTER_STATE', true);
        //apply to the current state of 'allRecies'
        filtered = doFilter(recipes);
      } else {
        //apply to previously filtered selection
        filtered = doFilter(fromCache);
      }

      commit('SET_ALL_RECIPES', filtered);
    },

    clearFilter({ commit, getters}) {
      //get state from before applying a filter
      const fromCache = getters.filterCache;
      //restore that state
      commit('SET_ALL_RECIPES', fromCache);
      //set filter state and clear filter data
      commit('SET_FILTER_STATE', false);
      commit('SET_FILTER_DATA', {});
    },

    getAllRecipes({ commit, rootGetters }) {
      const functions = rootGetters['app/functions'];
      fetch(functions.readAll)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        const recipes = res.map((item) => {
          let temp = Object.assign({}, item.data); //create new object from DB data
          temp.refId = item.ref['@ref'].id; // add the database ID for edit/delete operations
          return temp; //return newly created temp object
        });

        commit('SET_ALL_RECIPES', recipes);
        commit('SET_FILTER_CACHE', recipes); //cache the current 'allRecipes' data, so we can restore it without another DB query

      })
      .catch((error) => {
        console.log("API error", error);
      })
    },

    updateRecipe({ dispatch, rootGetters }, recipeData) {
      const rId = recipeData.refId;
      const functions = rootGetters['app/functions'];
      let msg = {};

      fetch(`${functions.edit}/${rId}`, {
        body: JSON.stringify(recipeData),
        method: 'POST'
      })
      .then(response => {
        msg = { text: `Recipe "${recipeData.title}" successfully updated.`, type: 'success' };
        console.log("Success:", response);
        dispatch('app/sendToastMessage', msg, { root: true });
      })
      .catch((error) => {
        msg = { text: `Error updating recipe "${recipeData.title}".`, type: 'error' };
        console.log("API error:", error);
        dispatch('app/sendToastMessage', msg, { root: true });
      })
    }
  }
};