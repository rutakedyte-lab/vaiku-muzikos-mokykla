import { supabase } from './supabase.js'

async function testData() {
  const { data, error } = await supabase
    .from('Registracija')
    .select('*')

  if (error) {
    console.error("Oi! Kažkas nepavyko:", error)
  } else {
    console.log("Valio! Štai tavo duomenys:", data)
  }
}

testData()
