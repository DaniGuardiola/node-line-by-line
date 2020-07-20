import fs from 'fs'
import fsp from 'fs/promises'
import readline from 'readline'
import lineReader from 'line-reader'

const PWD_LIST_FILENAME = 'xato-net-10-million-passwords.txt'

// shared
// ------

const DEFAULT_CHUNK_SIZE = 64 // kb, same as fs.createReadStream()

function getFileReadStream (chunkSize = DEFAULT_CHUNK_SIZE) {
  // open file
  const readStream = fs.createReadStream(PWD_LIST_FILENAME, {
    encoding: 'utf8',
    highWaterMark: chunkSize * 1024 // kb
  })

  return readStream
}

function getChecker (pwd) {
  // checker function
  let match = false
  const isMatch = () => match
  const checkFn = testPwd => {
    if (testPwd === pwd) {
      match = true
      return true
    } else return false
  }

  return { checkFn, isMatch }
}

// method #1: loading the whole file 💀
// ------------------------------------

export async function checkPasswordWholeFile (pwd) {
  const { checkFn, isMatch } = getChecker(pwd)

  // data loading
  const passwordsFile = await fsp.readFile(PWD_LIST_FILENAME, {
    encoding: 'utf8'
  })
  const allPasswords = passwordsFile.split('\n')

  // data processing
  allPasswords.some(checkFn)

  // result return
  return isMatch()
}

// method #2: ReadStream
// --------------------

export async function checkPasswordReadStream (pwd, chunkSize) {
  const { checkFn, isMatch } = getChecker(pwd)

  // data loading
  const readStream = getFileReadStream(chunkSize)

  // data processing
  let previousLastLine = ''
  readStream.on('data', data => {
    const currentPwds = data.split('\n')
    // Done for passwords split in two chunks of the stream...
    // a default value of empty string (|| '') avoids the potential "undefined" value, which would
    // not be a common occurrence but definitely could happen for zero-length arrays,
    // in typescript that could probably never happen!
    currentPwds[0] = previousLastLine + (currentPwds[0] || '')
    previousLastLine = currentPwds.splice(-1)[0] || '' // splice mutates the original array
    currentPwds.some(checkFn) && readStream.destroy() // .some() stops at the first truthy value
  })

  // result return
  return new Promise((resolve, reject) => {
    readStream.on('end', () => {
      checkFn(previousLastLine) // in case it is the very last password
      resolve(isMatch())
    })
    readStream.on('close', () => resolve(isMatch())) // if destroyed
    readStream.on('error', reject)
  })
}

// method #3: readline
// ------------------

export async function checkPasswordReadline (
  pwd,
  chunkSize = DEFAULT_CHUNK_SIZE
) {
  const { checkFn, isMatch } = getChecker(pwd)

  // data loading
  const readStream = getFileReadStream(chunkSize)
  const rl = readline.createInterface(readStream)

  // data processing
  rl.on('line', testPwd => {
    if (checkFn(testPwd)) {
      rl.close()
      readStream.destroy()
    }
  })

  // result return
  return new Promise((resolve, reject) => {
    rl.on('close', () => resolve(isMatch()))
    readStream.on('error', reject)
  })
}

// method #4: line-reader
// ---------------------

export async function checkPasswordLineReader (
  pwd,
  chunkSize = DEFAULT_CHUNK_SIZE
) {
  const { checkFn, isMatch } = getChecker(pwd)

  return new Promise(resolve => {
    // data loading
    const readStream = getFileReadStream(chunkSize)
    lineReader.eachLine(
      readStream,
      { bufferSize: chunkSize * 1024, separator: '\n' },

      // data processing
      line => !checkFn(line),

      // result return
      () => resolve(isMatch())
    )
  })
}
