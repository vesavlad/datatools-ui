// @flow

import React from 'react'

import { getComponentMessages } from '../../common/util/config'
import type { EditorValidationIssue } from '../util/validation'

const VALIDATION_ERROR_LIMIT = 3

const ExceptionValidationErrorsList = (props: {validationErrors: Array<EditorValidationIssue>}) => {
  const messages = getComponentMessages('ExceptionValidationErrorsList')
  const { validationErrors } = props

  return (
    <div>
      {validationErrors.map((err, index) => {
        if (index < VALIDATION_ERROR_LIMIT) return <div style={{color: 'darkred', margin: '5px 0px'}}>{err.reason}</div>
      })}
      {validationErrors.length - VALIDATION_ERROR_LIMIT > 0 && (
        <div style={{color: 'darkred'}}>
          {messages('andOtherErrors').replace('%errors%', (validationErrors.length - VALIDATION_ERROR_LIMIT).toString())}
        </div>
      )}
    </div>
  )
}

export default ExceptionValidationErrorsList
