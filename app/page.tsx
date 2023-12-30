'use client'

import googleSecret from '../google-secret.json'
import React, { useState, useEffect } from 'react'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library';


// Auth for Sheets
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: googleSecret.client_email,
  key: googleSecret.private_key,
  scopes: SCOPES,
});

// Sheets config variables
const SPREADSHEET_ID = "1-BlGsmxcBeYy4PebLfrRTBdpfqUh7kwx8rrBx0uauwc"
const SHEET_ID = "405578724"

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwt)

export default function Home() {
  
  enum Color {
    GREEN = 'green',
    BLUE = 'blue',
    RED = 'red',
    BLACK = 'black'
  }

  const colorOrder = Object.values(Color);

  const stringToCss = {
    "green": "bg-green-600",
    "blue": "bg-blue-600",
    "red": "bg-red-600",
    "black": "bg-gray-800"
  }

  interface Slope {
    name: string,
    color: Color,
    area: string,
    zone: string,
    spreadSheetRow?: any
  }

  const [greenFilter, setGreenFilter] = useState(false)
  const [blueFilter, setBlueFilter] = useState(false)
  const [redFilter, setRedFilter] = useState(false)
  const [blackFilter, setBlackFilter] = useState(false)

  const [areaFilter, setAreaFilter] = useState("none")
  const [zoneFilter, setZoneFilter] = useState("none")

  const [slopes, setSlopes] = useState<Slope[]>([])
  const [finishedSlopes, setFinishedSlopes] = useState<Slope[]>([])

  const [user, setUser] = useState("")

  useEffect(() => {
    doc.loadInfo().then(async () => {
      const rows = await doc.sheetsById[SHEET_ID].getRows()
      const slopesData: Slope[] = rows.filter(row => row.get(user) == 'FALSE').map(row => ({
        name: row.get('Name'),
        area: row.get('Area'),
        zone: row.get('Zone'),
        color: row.get('Color'),
        spreadSheetRow: row
      }))

      slopesData.sort(slopeSort)
      setSlopes(slopesData);

      const finishedSlopesData: Slope[] = rows.filter(row => row.get(user) == 'TRUE').map(row => ({
        name: row.get('Name'),
        area: row.get('Area'),
        zone: row.get('Zone'),
        color: row.get('Color'),
        spreadSheetRow: row
      }))

      finishedSlopesData.sort(slopeSort)
      setFinishedSlopes(finishedSlopesData);

    })
  }, [user])

  function slopeSort(a: Slope, b: Slope) {
    return b.area.localeCompare(a.area) || a.zone.localeCompare(b.zone) || colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color) || a.name.localeCompare(b.name)
  }

  function colorFilterFunction(element: { color: string }) {
    if (!greenFilter && !blueFilter && !redFilter && !blackFilter) {
      return true
    }

    if (greenFilter && element.color == "green") {
      return true
    }
    if (blueFilter && element.color == "blue") {
      return true
    }
    if (redFilter && element.color == "red") {
      return true
    }
    if (blackFilter && element.color == "black") {
      return true
    }

    return false
  }

  function areaFilterFunction(element: {area: string}) {
    return areaFilter == "none" || areaFilter == element.area
  }

  function zoneFilterFunction(element: {zone: string}) {
    return zoneFilter == "none" || zoneFilter == element.zone
  }

  async function clickSlopeFunction(slope: Slope) {
    slope.spreadSheetRow.assign({
      [user]: "TRUE"
    })
    await slope.spreadSheetRow.save()
    setSlopes(slopes.filter(e => e != slope))
    setFinishedSlopes([...finishedSlopes, slope].sort(slopeSort))
  }

  async function clickFinishedSlopeFunction(slope: Slope) {
    slope.spreadSheetRow.assign({
      [user]: "FALSE"
    })
    await slope.spreadSheetRow.save()
    setFinishedSlopes(finishedSlopes.filter(e => e != slope))
    setSlopes([...slopes, slope].sort(slopeSort))
  }

  function setUserFunction(selection: string) {
    setUser(selection)
  }

  const zonesLesArc = [
    "Arc 1600",
    "Arc 1800",
    "Arc 2000",
    "Peisey Vallandry",
    "Villarogers"
  ]

  const zonesLaPlagne = [
    "Altitude Domain",
    "Champagny en Vanoise",
    "Plagne Montalbert",
    "Montchavin - Les Coches"
  ]

  return (
    <main className="flex font-sans min-h-screen flex-col items-center p-2">

      <select name={areaFilter} onChange={e => setUserFunction(e.target.value)} className="font-bold bg-gray-100 dark:bg-gray-700 py-1 px-2 m-1 rounded w-full">
        <option value="">Ik ben...</option>
        <option value="Brigitte">Brigitte</option>
        <option value="Chris">Chris</option>
        <option value="Karianne">Karianne</option>
        <option value="Christiaan">Christiaan</option>
        <option value="Sifra">Sifra</option>
        <option value="Maarten">Maarten</option>
        <option value="Daniël">Daniël</option>
        <option value="Pepijn">Pepijn</option>
        <option value="Joëlle">Joëlle</option>
        <option value="Inge">Inge</option>
        <option value="Melle">Melle</option>
      </select>

      {/* Only display page if username is set */}

      {user == "" ? null :
        <div>
          <div className="flex flex-row justify-between">
            <button className={`font-bold py-1 px-2 m-1 rounded border-2 border-green-600 ${greenFilter ? "bg-green-600 hover:border-green-800 hover:bg-green-800 text-white" : "text-green-600 hover:text-green-800 hover:border-green-800"}`} onClick={() => setGreenFilter(!greenFilter)}>Groen</button>
            <button className={`font-bold py-1 px-2 m-1 rounded border-2 border-blue-600 ${blueFilter ? "bg-blue-600 hover:border-blue-800 hover:bg-blue-800 text-white" : "text-blue-600 hover:text-blue-800 hover:border-blue-800"}`} onClick={() => setBlueFilter(!blueFilter)}>Blauw</button>
            <button className={`font-bold py-1 px-2 m-1 rounded border-2 border-red-600 ${redFilter ? "bg-red-600 hover:border-red-800 hover:bg-red-800 text-white" : "text-red-600 hover:text-red-800 hover:border-red-800"}`} onClick={() => setRedFilter(!redFilter)}>Rood</button>
            <button className={`font-bold py-1 px-2 m-1 rounded border-2 border-gray-800 dark:border-gray-600 ${blackFilter ? "bg-gray-800 dark:bg-gray-600 hover:border-black dark:hover:border-gray-800 hover:bg-black dark:hover:bg-gray-800 text-white" : "text-gray-800 dark:text-gray-600 hover:text-black dark:hover:text-gray-800 hover:border-black dark:hover:border-gray-800"}`} onClick={() => setBlackFilter(!blackFilter)}>Zwart</button>
          </div>
          <select name={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="font-bold bg-gray-100 dark:bg-gray-700 py-1 px-2 m-1 rounded w-full">
            <option value="none">Filter een gebied...</option>
            <option value="Les Arcs">Les Arcs</option>
            <option value="La Plagne">La Plagne</option>
          </select>
          <select name={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="font-bold bg-gray-100 dark:bg-gray-700 py-1 px-2 m-1 rounded w-full">
            <option value="none">Filter een zone...</option>
            {(areaFilter == "none" || areaFilter == 'Les Arcs') && zonesLesArc.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}
            {(areaFilter == "none" || areaFilter == 'La Plagne') && zonesLaPlagne.map((item, index) => (
              <option value={item} key={index}>{item}</option>
            ))}

          </select>
        </div>
      }

      {user != "" && slopes.filter(e => colorFilterFunction(e) && areaFilterFunction(e) && zoneFilterFunction(e)).map((item, index) => (
        <button className="flex flex-row my-2 p-1 hover:bg-yellow-100 hover:text-black rounded-lg" key={index} onClick={() => clickSlopeFunction(item)}>
          <div className={`w-4 h-4 self-center rounded-full px-1 ${stringToCss[item.color]}`}></div>
          <div className="text-2xl self-center font-bold px-1">{item.name}</div>
          <div className="text-sm italic px-1 self-start">{item.zone}</div>
        </button>
      ))}

      {user != "" && finishedSlopes.filter(e => colorFilterFunction(e) && areaFilterFunction(e) && zoneFilterFunction(e)).map((item, index) => (
        <button className="flex flex-row my-2 p-1 bg-yellow-200 hover:bg-yellow-400 text-black rounded-lg" key={index} onClick={() => clickFinishedSlopeFunction(item)}>
          <div className={`w-4 h-4 self-center rounded-full px-1 ${stringToCss[item.color]}`}></div>
          <div className="text-2xl self-center font-bold px-1">{item.name}</div>
          <div className="text-sm italic px-1 self-start">{item.zone}</div>
        </button>
      ))}
      
    </main>
  )
}
