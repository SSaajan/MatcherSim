import { describe, it, expect } from 'vitest'
import parseCSVLine from '../src/utils/csvParser.js'

describe('parseCSVLine', () => {
    it('should parse simple CSV line', () => {
      const line = 'A,2024-01-01T10:00:00Z,300'
      const result = parseCSVLine(line)
      expect(result).toEqual(['A', '2024-01-01T10:00:00Z', '300'])
    })

    it('should handle nested fields', () => {
      const line = 'PROC001,2025-07-28T09:59:00.000Z,4,"{""resource_type"":""GPU"",""os"":""Linux""}","{""location"":{""zone"":""zone-1"",""priority"":1},""capacity_class"":{""class"":""high"",""priority"":2}}"'
      const result = parseCSVLine(line)
      expect(result).toEqual(['PROC001', '2025-07-28T09:59:00.000Z', '4', '{"resource_type":"GPU","os":"Linux"}', '{"location":{"zone":"zone-1","priority":1},"capacity_class":{"class":"high","priority":2}}'])
    })
  })