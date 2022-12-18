import * as dotenv from 'dotenv'

export default function loadEnv () {
  if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: '.local.env' })
  }

  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env' })
  }

  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.dev.env' })
  }
  return console.log('Enviroment loading!')
}
