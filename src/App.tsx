import style from './App.module.css'
import { NetParticles } from './components/net-particles/net-particles'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function App() {
  const [particleData, setParticleData] = useState({})
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    const newData = structuredClone(data)
    newData.showMouseBorder = newData.showMouseBorder === 0 ? false : true
    setParticleData(newData)
  }

  return (
    <div className={style.App}>
      <div className={style.menuWrapper}>
        <span className={style.title}>⚙️ Настройки ⚙️</span>
        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
          <ul className={style.list}>
            {/* Particle */}
            <li className={style.handler}>
              <span className={style.label}>Макс. размер точки (диапазон)</span>
              <input className={style.inputField} type="number" defaultValue={10} {...register('maxSize', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Мин. размер точки (если равно макс - диапазона нет)</span>
              <input className={style.inputField} type="number" defaultValue={5} {...register('minSize', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Макс. скорость точки</span>
              <input className={style.inputField} type="number" defaultValue={2} {...register('maxSpeed', { valueAsNumber: true })} />
            </li>
            {/* life */}
            <li className={style.handler}>
              <span className={style.label}>Время жизни (по 100) Если 0 - бессмертные клетки</span>
              <input className={style.inputField} type="number" defaultValue={200} step={100} {...register('lifeTime', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Минимальная прозрачность (если 1 отключает изменение прозрачности со временем)</span>
              <input className={style.inputField} type="number" step={0.1} defaultValue={0.5} {...register('minOpacity', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Минимальный размер от срока жизни (точка уменьшается со временем)</span>
              <input className={style.inputField} type="number" defaultValue={5} {...register('minSizeByLife', { valueAsNumber: true })} />
            </li>
            {/* lines */}
            <li className={style.handler}>
              <span className={style.label}>Длина линий между точками, если 0 - отключено</span>
              <input className={style.inputField} type="number" defaultValue={100} {...register('lineLength', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Причина линий, может быть length, all, opacity - поэкспериментируйте</span>
              <input className={style.inputField} type="text" defaultValue={'length'} {...register('lineReason')} />
            </li>
            {/* mouse */}
            <li className={style.handler}>
              <span className={style.label}>Столкновения мыши, 0 - отключено, больше 0 - больше радиус</span>
              <input className={style.inputField} type="number" defaultValue={25} {...register('mouseCollision', { valueAsNumber: true })} />
            </li>
            {/* Global Particles */}
            <li className={style.handler}>
              <span className={style.label}>Количество частиц, если 0 заполняет все поле</span>
              <input className={style.inputField} type="number" defaultValue={0} {...register('numberOfParticles', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Форсировать случайные цвета, цифра = количеству цветов, 0 отключено</span>
              <input className={style.inputField} type="number" defaultValue={100} {...register('forceRandomColors', { valueAsNumber: true })} />
            </li>
            {/* Canvas Settings */}
            <li className={style.handler}>
              <span className={style.label}>Показать границу радиуса мыши, если включена коллизия 1 - да, 0 - нет</span>
              <input className={style.inputField} type="number" defaultValue={0} {...register('showMouseBorder', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Цвет границы мыши, можно писать как словами, так и #hex и даже rgb()</span>
              <input className={style.inputField} type="text" defaultValue={'yellow'} {...register('mouseBorderColor')} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Ширина поля, по умолчанию - весь экран</span>
              <input className={style.inputField} type="number" defaultValue={0} {...register('CanvasWidth', { valueAsNumber: true })} />
            </li>
            <li className={style.handler}>
              <span className={style.label}>Высота поля, по умолчанию - весь экран</span>
              <input className={style.inputField} type="number" defaultValue={0} {...register('CanvasHeight', { valueAsNumber: true })} />
            </li>
          </ul>
          <input className={style.submitBtn} type="submit" value="Сгенерировать" />
        </form>
      </div>
      {Object.keys(particleData).length !== 0 && <NetParticles {...particleData} />}
    </div>
  )
}

export default App
