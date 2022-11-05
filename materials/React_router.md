## Библиотека react-router
Эта библиотека популярна, довольна проста в использовании и обладает [хорошей документацией](https://v5.reactrouter.com/web/guides/quick-start). Она предоставляет такие возможности как: \
`-` Навигация по клику (компонент <Link>). \
`-` Перенаправление (компонент <Redirect>). \
`-` Маршрутизация (компонент Route). \
`-` История (свойство history).

Это лишь малая часть того, что умеет библиотека. 

Пример простого роутинга:
```
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
```
