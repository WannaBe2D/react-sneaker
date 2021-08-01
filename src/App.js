import './index.scss';
import Header from './components/Header';
import axios from 'axios';
import React from 'react';
import AppContext from './context';
import Drawer from './components/Drawer';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';


function App() {

  const [items, setItems] = React.useState([]);

  const [cartOpened, setCartOpened] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState('');

  const [cartItems, setCartItems] = React.useState([]);
  const [favoriteItems, setFavorite] = React.useState([]);
  const [orderId, setOrderId] = React.useState(18);

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const itemsResponse = await axios.get("https://mdatest2.herokuapp.com/api/react_sneakers/");
      const cartResponse = await axios.get("https://mdatest2.herokuapp.com/api/react_cart/");
      const favoriteResponse = await axios.get("https://mdatest2.herokuapp.com/api/react_favorite/");

      setIsLoading(false);
      setCartItems(cartResponse.data['0']['sneakers']);
      setFavorite(favoriteResponse.data['0']['sneakers']);
      setItems(itemsResponse.data);
    }

    fetchData();
  }, []);

  const onChangeValue = (event) => {
    setSearchValue(event.target.value);
  }

  const addToFovarite = async (id) => {
    try {
      if (favoriteItems.find(e => e.id === id)) {
        axios.delete(`https://mdatest2.herokuapp.com/api/react_favorite/`, {
          data: {
            "id": id
          }
        })
        setFavorite(prev => prev.filter((e) => e.id !== id))
      } else {
        const { data } = await axios.post("https://mdatest2.herokuapp.com/api/react_favorite/", {
          "id": id
        })
        setFavorite(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
  }

  const addToCart = async (id) => {
    try {
      if (cartItems.find(e => e.id === id)) {
        axios.delete(`https://mdatest2.herokuapp.com/api/react_cart/`, {
          data: {
            "id": id
          }
        })
        setCartItems(prev => prev.filter((e) => e.id !== id))
      } else {
        const { data } = await axios.post("https://mdatest2.herokuapp.com/api/react_cart/", {
          "id": id
        })
        setCartItems(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в корзину');
    }
  }

  const removeItemCart = (id) => {
    axios.delete(`https://mdatest2.herokuapp.com/api/react_cart/`, {
      data: {
        "id": id
      }
    })
    setCartItems(prev => prev.filter((item) => item.id !== id))
  }

  const isItemAdded = (id) => {
    return cartItems.some((item) => item.id === id)
  }

  const isItemFavorited = (id) => {
    return favoriteItems.some((item) => item.id === id)
  }

  const onClose = () => {
    setCartOpened(false)
  }

  const createOrder = async (id) => {
    try {
      const { data } = await axios.post('https://mdatest2.herokuapp.com/api/react_order/', {
        "sneakers": id
      })
      setCartItems([]);
      setOrderId(data.id)
    } catch (error) {
      alert('Не удалось сделать заказ')
    }
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favoriteItems, isItemAdded, addToFovarite, isItemFavorited, onClose, createOrder, orderId }}>
      <div className="wrapper clear">
        {cartOpened && <Drawer onRemove={removeItemCart} items={cartItems} />}
        <Header onClickCart={() => setCartOpened(true)} />

        <Switch>
          <Route path="" exact>
            <Home
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeValue={onChangeValue}
              items={items}
              addToCart={addToCart}
              cartItems={cartItems}
              isLoading={isLoading}
            />
          </Route>
          <Route path="/favorites">
            <Favorites
              addToCart={addToCart}
            />
          </Route>

          <Route path="/orders">
            <Orders />
          </Route>
        </Switch>
      </div>
    </AppContext.Provider>
  );
}

export default App;
