<template>
    <div>
        <nav-header ></nav-header>
        <nav-bread>
            <span slot="bread">Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default " :class="{'cur': sortFlag}" @click="sortGoods(true)">Default</a>
                    <a href="javascript:void(0)" class="price" :class="{'cur': !sortFlag}" @click="sortGoods(false)">Price &darr;</a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur': priceChecked==='all'}">All</a></dd>
                            <dd v-for="(price,index) in priceFilter" @click="setPriceFilter(index)">
                                <a href="javascript:void(0)" :class="{'cur': priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item, index) in goodsList">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'/static/' + item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice | currency}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                                <img v-show="loading" src="../assets/loading-spinning-bubbles.svg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <v-modal :mdShow="mdShow" @closeModal="mdShow=false">
            <p slot="message">
                请先登录，否则无法加入到购物车中！
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
            </div>
        </v-modal>
        <v-modal :mdShow="mdShowCart" @closeModal="mdShowCart=false">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功!</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
                <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
            </div>
        </v-modal>

        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import '../assets/css/base.css'
    import '../assets/css/product.css'
    import NavHeader from '../components/Header'
    import NavFooter from '../components/Footer'
    import NavBread from '../components/NavBread'
    import VModal from '../components/Modal'
  export default {
    data() {
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '5000.00'
          },
        ],
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false,
        busy: true,
        loading: false,
        mdShow: false,
        mdShowCart: false,
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      VModal
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList(flag) {
        let param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        };
        this.loading = true;
        this.$ajax.get('/goods/list',{
          params: param
        }).then((res) => {
          let data = res.data;
          this.loading = false;
          if(flag) {
            this.goodsList = this.goodsList.concat(data.result.list);

            if(data.result.count === 0){
              this.busy = true;
            }else{
              this.busy = false;
            }
          }else{
            this.goodsList = data.result.list;
            this.busy = false;
          }
        })
      },
      sortGoods(flag) {
        this.sortFlag = flag;
        this.page = 1;
        this.getGoodsList();
      },
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter(index) {
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
        this.closePop();
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      loadMore() {
        //禁止再次滚动
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      addCart(productId) {
        this.$ajax.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          let data = res.data;
          if(data.status === '0') {
            this.mdShowCart = true;
            this.$store.commit('updateCartCount', 1);
          }else{
            this.mdShow = true;
          }
        });
      }
    }
  }
</script>

<style scoped>
.accessory-list-wrap ul::after{
    clear: both;
    content: '';
    height: 0;
    display: block;
    visibility: hidden;
}
    .load-more{
        height: 100px;
        text-align: center;
    }
</style>