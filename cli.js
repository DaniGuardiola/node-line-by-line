process.on('SIGINT', function () {
  console.log('\nAborting!')
  process.exit(1)
})

export default async function cliRunChecker (passwordChecker) {
  // get arguments
  const pwd = process.argv[2]
  const chunkSize = process.argv[3]
  if (!pwd) throw new Error('Missing password!')

  console.log(`Checking password '${pwd}'"`)

  // run the checker
  console.time('Time spent')
  try {
    const result = await passwordChecker(pwd, chunkSize)
    console.log(`> ${result ? 'Found (unsafe 🚫)' : 'Not found (safe ✅)'}`)
  } catch (error) {
    console.log('❌ Error!', error.message)
  }

  // performance
  console.log('\n----\n')
  console.timeEnd('Time spent')
  const memoryUsedMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  console.log(`Memory used: ${memoryUsedMb}MB`)
}
