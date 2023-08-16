// @flow

// $FlowFixMe Flow is outdated
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { parseString } from '@fast-csv/parse'

import { getComponentMessages } from '../../../common/util/config'

type Props = {
  buttonText?: string,
  csvData?: ?string,
  headerText?: string,
  hideSaveButton?: boolean,
  inputIsSame?: boolean,
  name?: string,
  onChangeCsvData: (SyntheticInputEvent<HTMLInputElement>) => void,
  onSaveCsvData: () => void,
}
const CustomCSVForm = (props: Props) => {
  const [errorCount, setErrorCount] = useState(0)

  const { buttonText, csvData, headerText, hideSaveButton, inputIsSame, name, onChangeCsvData, onSaveCsvData } = props

  useEffect(() => {
    setErrorCount(0)

    parseString(csvData, { headers: true })
      .on('error', _ => setErrorCount(errorCount + 1))
  }, [csvData])

  const numLines = !csvData ? 0 : csvData.split(/\r*\n/).length
  const messages = getComponentMessages('CustomCSVForm')

  const csvIsValid = errorCount === 0

  return (
    <div>
      <label
        htmlFor='csvData'
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          flexDirection: 'column'
        }}
      >
        {headerText}
        <textarea
          id='csvData'
          name={name}
          onChange={onChangeCsvData}
          placeholder={
            `stop_id,stop_code,stop_name,stop_lat,stop_lon\n1234567,188390987,Broad Ave,33.98768,-87.72686`
          }
          style={{
            fontFamily: 'monospace',
            fontSize: 'x-small',
            height: '80px',
            overflow: 'auto',
            whiteSpace: 'pre',
            width: '400px'
          }}
          value={csvData} />
      </label>
      <div style={{marginBottom: '10px'}}>
        {!hideSaveButton && <Button
          bsSize='xsmall'
          disabled={!csvIsValid || inputIsSame}
          onClick={onSaveCsvData}
          style={{marginRight: '5px'}}
        >
          {buttonText}
        </Button>}
        <small>{messages('numLines').replace('%numLines%', numLines.toString())}</small>
        {!csvIsValid && <small style={{paddingLeft: '1ch', color: 'red'}}>{messages('csvInvalid')}</small>}
      </div>
    </div>
  )
}

export default CustomCSVForm
