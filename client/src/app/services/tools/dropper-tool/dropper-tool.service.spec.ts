import { TestBed } from '@angular/core/testing';

import { DropperToolService } from '../dropper-tool/dropper-tool.service';

describe('DropperToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropperToolService = TestBed.get(DropperToolService);
    expect(service).toBeTruthy();
  });
});