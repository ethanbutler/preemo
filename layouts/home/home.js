import colors from '../../assets/js/colorUtilities'
import css from './_home.scss'


const Home = () => {
  const { random, darken, lighten } = colors
  const items = document.querySelectorAll('.content')

  const bgColor = el => {
    const bg = `#${lighten(random('ffff00', 80), 30)}`
    el.dataset.color = bg
    el.style.backgroundColor = bg
    el.style.color = bg


    const gradTop  = el.querySelectorAll('.content-gradTop')[0]
    const gradLeft = el.querySelectorAll('.content-gradLeft')[0]
    gradTop.style.backgroundImage = `linear-gradient(to bottom, transparent, ${bg})`
    gradTop.style.bottom = '100%'
    gradTop.style.opacity = 1
    gradLeft.style.backgroundImage = `linear-gradient(to right, transparent, ${bg})`
    gradLeft.style.right = '100%'
    gradLeft.style.opacity = 1

    const heading = el.querySelectorAll('.content-heading')[0]
    heading.style.borderColor = bg;
  }

  setTimeout(() => {
    [].forEach.call(items, item => {
      bgColor(item)
    })
  }, 0)

}

module.exports = Home
