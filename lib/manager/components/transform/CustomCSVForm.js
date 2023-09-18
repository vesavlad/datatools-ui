// @flow

import React from 'react'
import { Button } from 'react-bootstrap'

import { getComponentMessages } from '../../../common/util/config'

type Props = {
  buttonText: string,
  csvData: ?string,
  headerText: string,
  inputIsSame: boolean,
  onChangeCsvData: (SyntheticInputEvent<HTMLInputElement>) => void,
  onSaveCsvData: () => void,
}
const CustomCSVForm = (props: Props) => {
  const { buttonText, csvData, headerText, inputIsSame, onChangeCsvData, onSaveCsvData } = props

  const numLines = !csvData ? 0 : csvData.split(/\r*\n/).length
  const messages = getComponentMessages('CustomCSVForm')

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
        <Button
          bsSize='xsmall'
          disabled={inputIsSame}
          onClick={onSaveCsvData}
          style={{marginRight: '5px'}}
        >
          {buttonText}
        </Button>
        <small>{messages('numLines').replace('%numLines%', numLines.toString())}</small>
      </div>
    </div>
  )
}

export default CustomCSVForm
