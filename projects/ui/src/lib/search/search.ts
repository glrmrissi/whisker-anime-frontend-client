import { Component, signal, inject, OnInit, OnDestroy } from "@angular/core";
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, finalize } from "rxjs";
import { SearchService } from "./search.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";

@Component({
    selector: "app-search",
    imports: [FaIconComponent],
    standalone: true,
    templateUrl: "search.html",
    styleUrl: "search.css"
})
export class Search implements OnInit, OnDestroy {
    private searchService = inject(SearchService);
    private readonly router = inject(Router)

    protected faSearch = faSearch;

    searchQuery = signal<string>('');
    results = signal<any[]>([]);
    isSearching = signal<boolean>(false);

    private searchSubject = new Subject<string>();

    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => this.isSearching.set(true)),
            switchMap(query => {
                if (!query.trim()) {
                    this.isSearching.set(false);
                    return [[]];
                }
                return this.searchService.searchAnime(query).pipe(
                    finalize(() => this.isSearching.set(false))
                );
            })
        ).subscribe({
            next: (data: any) => {
                this.results.set(data?.data || []);
            },
            error: (err) => {
                console.error(err);
                this.isSearching.set(false);
            }
        });
    }

    showSuggestions = signal(false);

    hideSuggestionsWithDelay() {
        setTimeout(() => this.showSuggestions.set(false), 200);
    }

    selectAnime(anime: any) {
        console.log('Selecionado:', anime);
        this.showSuggestions.set(false);
        this.router.navigate(['/anime', anime.id]);
    }

    onTyping(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
        this.searchSubject.next(value);
        console.log(value)
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }
}