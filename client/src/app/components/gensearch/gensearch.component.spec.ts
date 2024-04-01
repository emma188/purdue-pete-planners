import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GensearchComponent } from './gensearch.component';

describe('GensearchComponent', () => {
  let component: GensearchComponent;
  let fixture: ComponentFixture<GensearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GensearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GensearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
