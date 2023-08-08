import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCommandArticleComponent } from './modifier-command-article.component';

describe('ModifierCommandArticleComponent', () => {
  let component: ModifierCommandArticleComponent;
  let fixture: ComponentFixture<ModifierCommandArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierCommandArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierCommandArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
